USE onpf_db;

ALTER TABLE real_estate_files
    ADD COLUMN cadastral_data LONGTEXT NULL,
    ADD COLUMN registration_data LONGTEXT NULL;
