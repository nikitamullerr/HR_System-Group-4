# HR System Group 4

A simple HR management web application for tracking employees, attendance, payroll, time off, and performance reviews. The project is built as a static front-end demo with HTML, CSS, and JavaScript.

## Group Members

- Xabiso Phendu
- Rasool Fredericks
- Rushin Presence
- Nikita Muller

## Overview

This application provides a modern HR dashboard experience for managing key workforce operations in one place. It includes a login page, dashboard, employee management, attendance tracking, leave requests, payroll slips, and performance review tools.

## Features

- Secure demo login screen
- Dashboard overview for HR operations
- Employee information and management views
- Attendance tracking and attendance records
- Time-off and leave management
- Payroll and payslip viewing
- Performance review pages

## Project Structure

- index.html — login page
- dashboard.html — main dashboard entry point
- employees.html — employee-related interface
- attendance.html — attendance tracking page
- time_off.html — leave/time-off page
- payroll_payslips.html — payroll and payslip views
- performance_review.html — performance review page
- css/ — stylesheets
- javascript/ — page logic and interactivity

## Demo Credentials

Use the following demo account to sign in:

- Username: ModernTech
- Password: moderntech$

## Running the Project

Because this project is a static web app, you can open the files directly in a browser. For a more reliable local preview, run a simple server from the project folder

## Notes

This is a front-end demonstration project and uses local sample data stored in JSON files such as employee_info.json, attendance.json, and payroll_data.json.

## Challenges

- **Inconsistent data sources** — Some pages (`dashboard.js`, `employees.js`, `performance_review.js`) use sample data embedded directly in JS, while others (`time_off.js`, `attendance.js`) `fetch()` the same kind of data from `attendance.json`, `employee_info.json`, and `payroll_data.json`. Keeping both approaches in sync was easy to get wrong.
- **Relative paths for fetched data** — The JSON files sit at the project root, but the pages loading them don't. A wrong relative path in `fetch()` fails silently (no error, just missing data), which made bugs hard to trace.
- **Responsive layout** — Supporting screen sizes from mobile up to desktop meant layering multiple media queries in `style.css` and testing each page at every breakpoint.
- **Team coordination** — Splitting ownership across four people while keeping the design and code style consistent across pages built independently.

## Future Enhancements

-	Replace dummy/embedded data with a real backend and database and standardise data loading across all pages.
-	Add real authentication in place of the hardcoded demo login.
-	Add loading states for pages using fetch(), and persist changes instead of resetting on refresh.
-	Extend testing coverage across more browsers and devices.