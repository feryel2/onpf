package tn.gov.onpf.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.onpf.model.LegalDocument;

import java.util.List;

/**
 * مستودع الوثائق القانونية
 * Legal Document Repository
 */
@Repository
public interface LegalDocumentRepository extends JpaRepository<LegalDocument, Long> {
    List<LegalDocument> findByFileId(Long fileId);
}
