package tn.gov.onpf.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.gov.onpf.model.*;
import tn.gov.onpf.repository.*;
import java.time.LocalDate;
import java.util.*;

@Service @Transactional
public class FileWorkflowService {
    private final RealEstateFileRepository files; private final LegalDocumentRepository documents; private final OperationRepository operations; private final UserRepository users; private final ObjectMapper objectMapper;
    public FileWorkflowService(RealEstateFileRepository files, LegalDocumentRepository documents, OperationRepository operations, UserRepository users, ObjectMapper objectMapper) { this.files=files; this.documents=documents; this.operations=operations; this.users=users; this.objectMapper=objectMapper; }
    public Page<Map<String,Object>> list(int page, int size, String status, String fileNumber, String lotNumber, String query) {
        Pageable pageable=PageRequest.of(page, Math.min(Math.max(size,1),100), Sort.by("createdAt").descending()); Page<RealEstateFile> result;
        if(query!=null && !query.isBlank()) result=files.search(query.trim(), status==null || status.isBlank()?null:FileState.valueOf(status), pageable);
        else if(status!=null && !status.isBlank()) result=files.findByStatus(FileState.valueOf(status), pageable);
        else if(fileNumber!=null && !fileNumber.isBlank()) result=files.findByFileNumberContaining(fileNumber, pageable);
        else if(lotNumber!=null && !lotNumber.isBlank()) result=files.findByLotNumber(lotNumber, pageable); else result=files.findAll(pageable);
        return result.map(this::fileMap);
    }
    public Map<String,Object> one(Long id) { return fileMap(find(id)); }
    public Map<String,Object> create(Map<String,Object> data, String username) {
        String number=required(data,"fileNumber");
        if(files.findByFileNumber(number).isPresent()) throw new IllegalArgumentException("رقم الملف موجود مسبقاً");
        User editor=users.findByUsername(username).orElseThrow(()->new NoSuchElementException("المستخدم غير موجود"));
        RealEstateFile file=RealEstateFile.builder()
                .fileNumber(number)
                .lotNumber(required(data,"lotNumber"))
                .subject(required(data,"subject"))
                .filingDate(LocalDate.parse(required(data,"filingDate")))
                .source(string(data,"source"))
                .cadastralDataJson(toJson(data.get("cadastralData")))
                .status(FileState.NEW)
                .studyResponsible(editor)
                .assignedTo(editor)
                .build();
        file=files.save(file);
        saveInitialDocuments(file, data.get("documents"));
        log(file, username, "إنشاء ملف", null, FileState.NEW, null);
        return fileMap(file);
    }
    public Map<String,Object> update(Long id, Map<String,Object> data, String username) {
        RealEstateFile file=find(id); FileState old=file.getStatus();
        require(file, FileState.NEW, FileState.UNDER_STUDY, FileState.RETURNED_FOR_CORRECTION);
        // Corrige aussi les dossiers historiques créés avant l'affectation automatique.
        if(file.getStudyResponsible()==null) file.setStudyResponsible(users.findByUsername(username).orElseThrow(()->new NoSuchElementException("المستخدم غير موجود")));
        if(data.containsKey("subject")) file.setSubject(required(data,"subject")); if(data.containsKey("lotNumber")) file.setLotNumber(required(data,"lotNumber")); if(data.containsKey("source")) file.setSource(string(data,"source")); if(data.containsKey("notes")) file.setNotes(string(data,"notes"));
        if(data.containsKey("cadastralData")) file.setCadastralDataJson(toJson(data.get("cadastralData")));
        if(old==FileState.NEW || old==FileState.RETURNED_FOR_CORRECTION) file.setStatus(FileState.UNDER_STUDY);
        log(file,username,"حفظ الدراسة",old,file.getStatus(),file.getNotes()); return fileMap(files.save(file));
    }
    public Map<String,Object> addDocument(Long fileId, Map<String,Object> data, String username) {
        RealEstateFile file=find(fileId);
        require(file,FileState.NEW,FileState.UNDER_STUDY,FileState.RETURNED_FOR_CORRECTION);
        LegalDocument document=LegalDocument.builder().file(file).documentType(required(data,"type"))
                .documentNumber(required(data,"number")).documentDate(LocalDate.parse(required(data,"date")))
                .status(DocumentState.PENDING).verificationResult(VerificationDecision.PENDING).notes(string(data,"notes")).build();
        document=documents.save(document);
        log(file,username,"إضافة وثيقة",file.getStatus(),file.getStatus(),document.getDocumentType());
        return documentMap(document);
    }
    public void deleteDocument(Long fileId, Long documentId, String username) {
        RealEstateFile file=find(fileId);
        require(file,FileState.NEW,FileState.UNDER_STUDY,FileState.RETURNED_FOR_CORRECTION);
        LegalDocument document=documents.findById(documentId).orElseThrow(()->new NoSuchElementException("الوثيقة غير موجودة"));
        if(!document.getFile().getId().equals(file.getId())) throw new IllegalArgumentException("الوثيقة لا تنتمي إلى الملف");
        documents.delete(document);
        log(file,username,"حذف وثيقة",file.getStatus(),file.getStatus(),document.getDocumentType());
    }
        private void saveInitialDocuments(RealEstateFile file, Object value) {
            if(value==null) return;
            if(!(value instanceof List<?>)) throw new IllegalArgumentException("قائمة الوثائق غير صحيحة");
            for(Object item:(List<?>)value) {
                if(!(item instanceof Map<?,?>)) throw new IllegalArgumentException("بيانات الوثيقة غير صحيحة");
                Map<?,?> data=(Map<?,?>)item;
                documents.save(LegalDocument.builder().file(file).documentType(required(data,"type"))
                        .documentNumber(required(data,"number")).documentDate(LocalDate.parse(required(data,"date")))
                        .status(DocumentState.PENDING).verificationResult(VerificationDecision.PENDING)
                        .notes(string(data,"notes")).build());
            }
        }
        private String toJson(Object value) {
            if(value==null) return null;
            try { return objectMapper.writeValueAsString(value); }
            catch(JsonProcessingException exception) { throw new IllegalArgumentException("بيانات الملف غير صالحة",exception); }
        }
        private Map<String,Object> fromJson(String value) {
            if(value==null || value.isBlank()) return null;
            try { return objectMapper.readValue(value,new TypeReference<Map<String,Object>>(){}); }
            catch(JsonProcessingException exception) { throw new IllegalStateException("تعذر قراءة بيانات الملف",exception); }
        }
        private String required(Map<?,?>d,String key){String v=string(d,key);if(v==null||v.isBlank())throw new IllegalArgumentException("الحقل "+key+" إجباري");return v.trim();} private String string(Map<?,?>d,String key){Object v=d.get(key);return v==null?null:String.valueOf(v);}
    public Map<String,Object> assign(Long id, String username, String note) { RealEstateFile f=find(id); require(f, FileState.UNDER_STUDY, FileState.RETURNED_FOR_CORRECTION); FileState old=f.getStatus(); f.setAssignedTo(activeUser(Role.VERIFIER)); f.setStatus(FileState.AWAITING_VERIFICATION); f.setNotes(note); log(f,username,"إحالة إلى المتثبت",old,f.getStatus(),note); return fileMap(files.save(f)); }
    public Map<String,Object> approve(Long id, String username, String role, String note) {
        RealEstateFile file=find(id);
        FileState old=file.getStatus();
        User actor=user(username);
        if("VERIFIER".equals(role)) {
            require(file,FileState.AWAITING_VERIFICATION,FileState.UNDER_VERIFICATION);
            file.setAssignedTo(activeUser(Role.SENIOR_VERIFIER));
            file.setStatus(FileState.AWAITING_FINAL_VERIFICATION);
        } else if("SENIOR_VERIFIER".equals(role)) {
            require(file,FileState.AWAITING_FINAL_VERIFICATION,FileState.UNDER_FINAL_VERIFICATION);
            file.setAssignedTo(actor);
            file.setStatus(FileState.APPROVED);
            Map<String,Object> registration=new LinkedHashMap<>();
            registration.put("formalityNumber","FORM-2026-"+(8800+file.getId()));
            registration.put("volumeNumber","VOL-"+(420+file.getId()));
            registration.put("folioNumber",String.valueOf((file.getId()*14)+68));
            registration.put("effectiveDate",LocalDate.now().toString());
            registration.put("conservatorVisa",note);
            registration.put("certificateNumber","CERT-ONPF-2026-"+(91000+(file.getId()*235)));
            file.setRegistrationDataJson(toJson(registration));
        } else throw new SecurityException("Accès non autorisé");
        file.setNotes(note);
        log(file,username,"SENIOR_VERIFIER".equals(role)?"المصادقة النهائية":"إحالة إلى المتثبت الأعلى",old,file.getStatus(),note);
        return fileMap(files.save(file));
    }
    public Map<String,Object> returnForCorrection(Long id, String username, String role, String note) { RealEstateFile f=find(id); FileState old=f.getStatus(); if("VERIFIER".equals(role)) require(f,FileState.AWAITING_VERIFICATION,FileState.UNDER_VERIFICATION); else if("SENIOR_VERIFIER".equals(role)) require(f,FileState.AWAITING_FINAL_VERIFICATION,FileState.UNDER_FINAL_VERIFICATION); else throw new SecurityException("Accès non autorisé"); f.setAssignedTo(f.getStudyResponsible()); f.setStatus(FileState.RETURNED_FOR_CORRECTION); f.setNotes(note); log(f,username,"إرجاع للتصحيح",old,f.getStatus(),note); return fileMap(files.save(f)); }
    public Map<String,Object> verifyDocument(Long fileId, Long documentId, String username, Map<String,Object> data) { RealEstateFile f=find(fileId); User actor=user(username); LegalDocument d=documents.findById(documentId).orElseThrow(()->new NoSuchElementException("الوثيقة غير موجودة")); if(!d.getFile().getId().equals(f.getId())) throw new IllegalArgumentException("الوثيقة لا تنتمي إلى الملف"); String result=required(data,"result"); d.setVerificationResult(VerificationDecision.valueOf(result)); d.setStatus("APPROVED".equals(result)?DocumentState.VERIFIED:DocumentState.REJECTED); d.setNotes(string(data,"note")); if(f.getStatus()==FileState.AWAITING_VERIFICATION) { if(actor.getRole()!=Role.VERIFIER) throw new SecurityException("التثبت الأولي مخصص للمتثبت"); f.setStatus(FileState.UNDER_VERIFICATION); } else if(f.getStatus()==FileState.AWAITING_FINAL_VERIFICATION) { if(actor.getRole()!=Role.SENIOR_VERIFIER) throw new SecurityException("التثبت النهائي مخصص للمتثبت الأعلى"); f.setStatus(FileState.UNDER_FINAL_VERIFICATION); } else throw new IllegalStateException("الحالة الحالية لا تسمح بالتثبت من الوثيقة"); f.setAssignedTo(actor); log(f,username,"التثبت من الوثيقة",null,f.getStatus(),d.getNotes()); documents.save(d); return documentMap(d); }
    public Map<String,Object> statistics() { Map<String,Object> s=new LinkedHashMap<>(); s.put("totalFiles",files.count()); s.put("newFiles",files.countByStatus(FileState.NEW)); s.put("underStudy",files.countByStatus(FileState.UNDER_STUDY)); s.put("awaitingVerification",files.countByStatus(FileState.AWAITING_VERIFICATION)); s.put("returnedForCorrection",files.countByStatus(FileState.RETURNED_FOR_CORRECTION)); s.put("awaitingFinalVerification",files.countByStatus(FileState.AWAITING_FINAL_VERIFICATION)); s.put("underFinalVerification",files.countByStatus(FileState.UNDER_FINAL_VERIFICATION)); s.put("approved",files.countByStatus(FileState.APPROVED)); s.put("closed",files.countByStatus(FileState.CLOSED)); return s; }
    public Page<Map<String,Object>> operations(Long fileId, int page, int size) { Pageable p=PageRequest.of(page,Math.min(Math.max(size,1),100),Sort.by("timestamp").descending()); Page<Operation> result=fileId==null?operations.findAll(p):operations.findByFileId(fileId,p); return result.map(o->{Map<String,Object> m=new LinkedHashMap<>();m.put("id",o.getId());m.put("operationType",o.getOperationType());m.put("previousStatus",o.getPreviousStatus());m.put("newStatus",o.getNewStatus());m.put("notes",o.getNotes());m.put("timestamp",o.getTimestamp());m.put("fileId",o.getFile().getId());m.put("fileNumber",o.getFile().getFileNumber());m.put("user",o.getUser().getFullName());m.put("role",o.getUser().getRole().name());return m;}); }
    private RealEstateFile find(Long id){return files.findById(id).orElseThrow(()->new NoSuchElementException("الملف غير موجود"));}
    private User user(String username){return users.findByUsername(username).orElseThrow(()->new NoSuchElementException("المستخدم غير موجود"));}
    private User activeUser(Role role){return users.findFirstByRoleAndIsActiveTrueOrderByIdAsc(role).orElseThrow(()->new IllegalStateException("لا يوجد مستخدم نشط لهذا الدور"));}
    private void require(RealEstateFile f, FileState... states){for(FileState s:states)if(f.getStatus()==s)return;throw new IllegalStateException("الحالة الحالية لا تسمح بهذه العملية");}
    private void log(RealEstateFile f,String username,String type,FileState old,FileState next,String note){User u=users.findByUsername(username).orElseThrow(()->new NoSuchElementException("المستخدم غير موجود"));operations.save(Operation.builder().file(f).user(u).operationType(type).previousStatus(old==null?null:old.name()).newStatus(next==null?null:next.name()).notes(note).build());}
    private String required(Map<String,Object>d,String key){String v=string(d,key);if(v==null||v.isBlank())throw new IllegalArgumentException("الحقل "+key+" إجباري");return v.trim();} private String string(Map<String,Object>d,String key){Object v=d.get(key);return v==null?null:String.valueOf(v);}
    private Map<String,Object> fileMap(RealEstateFile f){Map<String,Object>m=new LinkedHashMap<>();m.put("id",f.getId());m.put("fileNumber",f.getFileNumber());m.put("lotNumber",f.getLotNumber());m.put("subject",f.getSubject());m.put("filingDate",f.getFilingDate());m.put("status",f.getStatus().name());m.put("source",f.getSource());m.put("notes",f.getNotes());m.put("cadastralData",fromJson(f.getCadastralDataJson()));m.put("registration",fromJson(f.getRegistrationDataJson()));m.put("studyResponsible",f.getStudyResponsible()==null?null:f.getStudyResponsible().getFullName());m.put("assignedTo",f.getAssignedTo()==null?null:f.getAssignedTo().getFullName());m.put("responsible",f.getAssignedTo()!=null?f.getAssignedTo().getFullName():(f.getStudyResponsible()==null?null:f.getStudyResponsible().getFullName()));m.put("documents",documents.findByFileId(f.getId()).stream().map(this::documentMap).toArray());return m;}
    private Map<String,Object> documentMap(LegalDocument d){Map<String,Object>m=new LinkedHashMap<>();m.put("id",d.getId());m.put("type",d.getDocumentType());m.put("number",d.getDocumentNumber());m.put("date",d.getDocumentDate());m.put("status",d.getStatus().name());m.put("notes",d.getNotes());m.put("verificationResult",d.getVerificationResult()==null?null:d.getVerificationResult().name());return m;}
}
