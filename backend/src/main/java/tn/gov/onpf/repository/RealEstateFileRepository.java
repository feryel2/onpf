package tn.gov.onpf.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.gov.onpf.model.RealEstateFile;
import tn.gov.onpf.model.FileState;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * مستودع الملفات العقارية
 * Real Estate File Repository
 */
@Repository
public interface RealEstateFileRepository extends JpaRepository<RealEstateFile, Long> {
    Optional<RealEstateFile> findByFileNumber(String fileNumber);
    
    Page<RealEstateFile> findByStatus(FileState status, Pageable pageable);
    
    Page<RealEstateFile> findByLotNumber(String lotNumber, Pageable pageable);
    
    Page<RealEstateFile> findByFileNumberContaining(String fileNumber, Pageable pageable);

        @Query("SELECT f FROM RealEstateFile f WHERE (:status IS NULL OR f.status = :status) AND (" +
            "LOWER(f.fileNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.lotNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.subject) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.notes) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.source) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(f.cadastralDataJson) LIKE LOWER(CONCAT('%', :query, '%'))) ")
        Page<RealEstateFile> search(@Param("query") String query, @Param("status") FileState status, Pageable pageable);
    
    List<RealEstateFile> findByAssignedToIdAndStatus(Long userId, FileState status);
    
    @Query("SELECT COUNT(f) FROM RealEstateFile f WHERE f.status = :status")
    long countByStatus(@Param("status") FileState status);
    
    @Query("SELECT COUNT(f) FROM RealEstateFile f WHERE DATE(f.filingDate) = CURDATE()")
    long countNewFilesFromToday();
}
