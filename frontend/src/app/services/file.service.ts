import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CadastralData {
  titleName?: string;
  location?: string;
  region?: string;
  surfaceM2?: number;
  propertyType?: string;
  previousOwner?: string;
  newOwner?: string;
  saleAmountTnd?: number;
  chargesStatus?: string;
  hasOpposition?: boolean;
}

export interface LegalRegistration {
  formalityNumber?: string;
  volumeNumber?: string;
  folioNumber?: string;
  effectiveDate?: string;
  conservatorVisa?: string;
  certificateNumber?: string;
}

export interface Document {
  id: string;
  type: string;
  number: string;
  date: string;
  status: string;
  notes?: string;
  verificationResult?: string;
  hasReservation?: boolean;
  reservationText?: string;
}

export interface RealEstateFile {
  id: string;
  fileNumber: string;
  lotNumber: string;
  subject: string;
  filingDate: string;
  status: string;
  source?: string;
  studyResponsible?: string;
  assignedTo?: string;
  responsible?: string;
  notes?: string;
  documents?: Document[];
  cadastralData?: CadastralData;
  registration?: LegalRegistration;
}

export interface OperationEntry {
  id: number;
  operationType: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
  timestamp: string;
  fileId: number;
  fileNumber: string;
  user: string;
  role: string;
}

export interface FileStatistics {
  totalFiles: number;
  newFiles: number;
  underStudy: number;
  awaitingVerification: number;
  returnedForCorrection: number;
  awaitingFinalVerification: number;
  underFinalVerification: number;
  approved: number;
  closed: number;
}

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getFiles(page: number = 0, size: number = 10, filters?: any): Observable<any> {
    let url = `${this.apiUrl}/files?page=${page}&size=${size}`;
    if (filters) {
      if (filters.status) url += `&status=${filters.status}`;
      if (filters.fileNumber) url += `&fileNumber=${filters.fileNumber}`;
      if (filters.lotNumber) url += `&lotNumber=${filters.lotNumber}`;
      if (filters.query?.trim()) url += `&q=${encodeURIComponent(filters.query.trim())}`;
    }
    return this.http.get<any>(url);
  }

  getFileById(id: string): Observable<RealEstateFile> {
    return this.http.get<RealEstateFile>(`${this.apiUrl}/files/${id}`);
  }

  getFileStatistics(): Observable<FileStatistics> {
    return this.http.get<FileStatistics>(`${this.apiUrl}/files/statistics`);
  }

  getOperations(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/operations?page=${page}&size=${size}`);
  }

  updateFile(id: string, file: Partial<RealEstateFile>): Observable<RealEstateFile> {
    return this.http.put<RealEstateFile>(`${this.apiUrl}/files/${id}`, file);
  }

  createFile(file: Partial<RealEstateFile>): Observable<RealEstateFile> {
    return this.http.post<RealEstateFile>(`${this.apiUrl}/files`, file);
  }

  assignFileToVerification(id: string, note?: string): Observable<RealEstateFile> {
    return this.http.post<RealEstateFile>(`${this.apiUrl}/files/${id}/assign-to-verification`, { note });
  }

  approveFile(id: string, note?: string): Observable<RealEstateFile> {
    return this.http.post<RealEstateFile>(`${this.apiUrl}/files/${id}/approve`, { note });
  }

  returnFileForCorrection(id: string, note: string): Observable<RealEstateFile> {
    return this.http.post<RealEstateFile>(`${this.apiUrl}/files/${id}/return-for-correction`, { note });
  }

  verifyDocument(fileId: string, documentId: string, result: string, note?: string): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/files/${fileId}/documents/${documentId}/verify`, { result, note });
  }

  addDocument(fileId: string, doc: Partial<Document>): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/files/${fileId}/documents`, doc);
  }

  deleteDocument(fileId: string, docId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/files/${fileId}/documents/${docId}`);
  }
}
