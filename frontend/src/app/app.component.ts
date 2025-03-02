import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClickService } from './services/click.service';

interface Course {
  credits: number;
  grade: string;
}

interface Semester {
  gpa: number;
  credits: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GPA & CGPA Calculator'; 
  // GPA Variables
  subjectCount: number = 1;
  courses: Course[] = [{ credits: 0, grade: 'O' }];
  gpa: number | null = null;
  grades: string[] = ['O', 'A+', 'A', 'B+', 'B', 'C', 'U'];

  // CGPA Variables
  semesterCount: number = 1;
  semesters: Semester[] = [{ gpa: 0, credits: 0 }];
  cgpa: number | null = null;

  // Click counts
  gpaClicks: number | null = null;
  cgpaClicks: number | null = null;

  // Date and Time
  currentDate: Date = new Date();
  currentTime: string = '';

  constructor(private http: HttpClient, private clickService: ClickService) {}

  ngOnInit() {
    this.getClickCounts();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  // Update Time
  updateTime() {
    const now = new Date();
    this.currentDate = now;
    this.currentTime = now.toLocaleTimeString();
  }

  // Update Course Array Based on Subject Count
  updateCourses() {
    const currentCount = this.courses.length;
    if (this.subjectCount > currentCount) {
      for (let i = currentCount; i < this.subjectCount; i++) {
        this.courses.push({ credits: 0, grade: 'O' });
      }
    } else {
      this.courses = this.courses.slice(0, this.subjectCount);
    }
  }

  // GPA Calculation
  calculateGPA() {
    this.http.post<any>('https://gpa-cgpa-calculator-yltr.onrender.com/api/gpa', { courses: this.courses })
      .subscribe(
        res => {
          this.gpa = parseFloat(res.gpa);
          this.trackClick('GPA');
        },
        err => console.error(err)
      );
  }

  // Update Semesters Array Based on Semester Count
  updateSemesters() {
    const currentCount = this.semesters.length;
    if (this.semesterCount > currentCount) {
      for (let i = currentCount; i < this.semesterCount; i++) {
        this.semesters.push({ gpa: 0, credits: 0 });
      }
    } else {
      this.semesters = this.semesters.slice(0, this.semesterCount);
    }
  }

  // CGPA Calculation
  calculateCGPA() {
    this.http.post<any>('https://gpa-cgpa-calculator-yltr.onrender.com/api/cgpa', { semesters: this.semesters })
      .subscribe(
        res => {
          this.cgpa = parseFloat(res.cgpa);
          this.trackClick('CGPA');
        },
        err => console.error(err)
      );
  }

  // Track Click and Update Counts
  trackClick(type: 'GPA' | 'CGPA') {
    this.clickService.trackClick(type).subscribe(
      () => this.getClickCounts(),
      err => console.error(err)
    );
  }

  // Fetch Click Counts from Server
  getClickCounts() {
    this.clickService.getClickCounts().subscribe(
      (data: any) => {
        const gpaClick = data.find((item: any) => item.type === 'GPA');
        const cgpaClick = data.find((item: any) => item.type === 'CGPA');
        this.gpaClicks = gpaClick ? gpaClick.count : 0;
        this.cgpaClicks = cgpaClick ? cgpaClick.count : 0;
      },
      err => console.error(err)
    );
  }
}
