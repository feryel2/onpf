package tn.gov.onpf.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * كيان الملف العقاري
 * Real Estate File Entity
 */
@Entity
@Table(name = "real_estate_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RealEstateFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_number", unique = true, nullable = false)
    private String fileNumber;

    @Column(name = "lot_number", nullable = false)
    private String lotNumber;

    @Column(name = "subject", nullable = false)
    private String subject;

    @Column(name = "filing_date", nullable = false)
    private LocalDate filingDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FileState status;

    @Column(name = "source")
    private String source;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_responsible_id")
    private User studyResponsible;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "cadastral_data", columnDefinition = "LONGTEXT")
    private String cadastralDataJson;

    @Column(name = "registration_data", columnDefinition = "LONGTEXT")
    private String registrationDataJson;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LegalDocument> documents;

    @OneToMany(mappedBy = "file", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Operation> operations;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = FileState.NEW;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

/**
 * حالات الملف
 * File Status Values
 */
enum FileStatus {
    NEW,                              // جديد
    UNDER_STUDY,                      // قيد الدراسة
    AWAITING_VERIFICATION,            // في انتظار التثبت
    UNDER_VERIFICATION,               // قيد التثبت
    RETURNED_FOR_CORRECTION,          // مرجع للتصحيح
    AWAITING_FINAL_VERIFICATION,      // في انتظار التثبت النهائي
    UNDER_FINAL_VERIFICATION,         // قيد التثبت النهائي
    APPROVED,                         // مصادق عليه
    CLOSED                            // مغلق
}
