package tn.gov.onpf.controller;

import org.springframework.data.domain.Page;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tn.gov.onpf.service.FileWorkflowService;
import java.util.*;

@RestController @RequestMapping("/files") @CrossOrigin(origins="http://localhost:4200")
public class FileController {
    private final FileWorkflowService service; public FileController(FileWorkflowService service){this.service=service;}
    @GetMapping public Page<Map<String,Object>> list(@RequestParam(defaultValue="0")int page,@RequestParam(defaultValue="10")int size,@RequestParam(required=false)String status,@RequestParam(required=false)String fileNumber,@RequestParam(required=false)String lotNumber,@RequestParam(required=false)String q){return service.list(page,size,status,fileNumber,lotNumber,q);}
    @GetMapping("/{id}") public Map<String,Object> one(@PathVariable Long id){return service.one(id);}
    @PostMapping @PreAuthorize("hasRole('EDITOR')") public Map<String,Object> create(@RequestBody Map<String,Object> body,Authentication a){return service.create(body,a.getName());}
    @PostMapping("/{fileId}/documents") @PreAuthorize("hasRole('EDITOR')") public Map<String,Object> addDocument(@PathVariable Long fileId,@RequestBody Map<String,Object> body,Authentication a){return service.addDocument(fileId,body,a.getName());}
    @DeleteMapping("/{fileId}/documents/{documentId}") @PreAuthorize("hasRole('EDITOR')") public Map<String,String> deleteDocument(@PathVariable Long fileId,@PathVariable Long documentId,Authentication a){service.deleteDocument(fileId,documentId,a.getName());return Collections.singletonMap("message","تم حذف الوثيقة.");}
    @PutMapping("/{id}") @PreAuthorize("hasRole('EDITOR')") public Map<String,Object> update(@PathVariable Long id,@RequestBody Map<String,Object> body,Authentication a){return service.update(id,body,a.getName());}
    @GetMapping("/statistics") public Map<String,Object> statistics(){return service.statistics();}
    @PostMapping("/{id}/assign-to-verification") @PreAuthorize("hasRole('EDITOR')") public Map<String,Object> assign(@PathVariable Long id,@RequestBody(required=false)Map<String,Object>body,Authentication a){return service.assign(id,a.getName(),body==null?null:(String)body.get("note"));}
    @PostMapping("/{id}/approve") @PreAuthorize("hasAnyRole('VERIFIER','SENIOR_VERIFIER')") public Map<String,Object> approve(@PathVariable Long id,@RequestBody(required=false)Map<String,Object>body,Authentication a){String role=a.getAuthorities().iterator().next().getAuthority().replace("ROLE_","");return service.approve(id,a.getName(),role,body==null?null:(String)body.get("note"));}
    @PostMapping("/{id}/return-for-correction") @PreAuthorize("hasAnyRole('VERIFIER','SENIOR_VERIFIER')") public Map<String,Object> returnForCorrection(@PathVariable Long id,@RequestBody Map<String,Object>body,Authentication a){String role=a.getAuthorities().iterator().next().getAuthority().replace("ROLE_","");return service.returnForCorrection(id,a.getName(),role,(String)body.get("note"));}
    @PostMapping("/{fileId}/documents/{documentId}/verify") @PreAuthorize("hasAnyRole('VERIFIER','SENIOR_VERIFIER')") public Map<String,Object> verify(@PathVariable Long fileId,@PathVariable Long documentId,@RequestBody Map<String,Object>body,Authentication a){return service.verifyDocument(fileId,documentId,a.getName(),body);}
}
