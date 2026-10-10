import { Component, OnInit } from '@angular/core';
import { FileService, FileStatistics } from '../../services/file.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  statistics: FileStatistics | null = null;

  constructor(private fileService: FileService) { }

  ngOnInit(): void {
    this.loadStatistics();
  }

  private loadStatistics(): void {
    this.fileService.getFileStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
      },
      error: (error) => {
        console.error('خطأ في تحميل الإحصائيات', error);
      }
    });
  }
}
