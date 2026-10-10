package tn.gov.onpf.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.gov.onpf.model.Operation;

/**
 * مستودع تسجيل العمليات
 * Operation Repository
 */
@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {
    Page<Operation> findByFileId(Long fileId, Pageable pageable);
    Page<Operation> findByUserId(Long userId, Pageable pageable);
}
