# Testing Report

**Project:** Event Flow

**Tested By:** Saamuel Kolandasamy

**Role:** Scrum Master

**Date:** 6 June 2025

---

## Overview

This report documents the functional testing conducted on the Event Flow application. All features were tested manually across supported browsers to ensure correct behaviour and usability.

---

## Test Environment

| Item | Details |
|------|---------|
| Tester | Saamuel Kolandasamy |
| Browsers Tested | Google Chrome, Microsoft Edge, Mozilla Firefox |
| Testing Type | Manual Functional Testing |
| Device | Laptop |

---

## Test Cases

### Sprint 1 — Core Features

| Test ID | Feature | Test Case | Expected Result | Actual Result | Status |
|---------|---------|-----------|-----------------|---------------|--------|
| TC-01 | User Registration | Register with a new username and password | Account created successfully | Account created successfully | ✅ Pass |
| TC-02 | User Registration | Register with an existing username | Error message displayed | Error message displayed | ✅ Pass |
| TC-03 | User Login | Login with correct credentials | Redirected to task list | Redirected to task list | ✅ Pass |
| TC-04 | User Login | Login with incorrect credentials | Error message displayed | Error message displayed | ✅ Pass |
| TC-05 | Create Task | Create a task with title, description, and deadline | Task appears in task list | Task appears in task list | ✅ Pass |
| TC-06 | Create Task | Submit form with empty fields | Validation error displayed | Validation error displayed | ✅ Pass |
| TC-07 | View Task List | Open task list page | All tasks displayed correctly | All tasks displayed correctly | ✅ Pass |

---

### Sprint 2 — Enhanced Features

| Test ID | Feature | Test Case | Expected Result | Actual Result | Status |
|---------|---------|-----------|-----------------|---------------|--------|
| TC-08 | Edit Task | Edit an existing task's details | Task updated successfully | Task updated successfully | ✅ Pass |
| TC-09 | Delete Task | Delete a task with confirmation | Task removed from list | Task removed from list | ✅ Pass |
| TC-10 | Delete Task | Cancel deletion on confirmation modal | Task remains in list | Task remains in list | ✅ Pass |
| TC-11 | Task Status | Change task status (To Do → In Progress → Done) | Status updated correctly | Status updated correctly | ✅ Pass |
| TC-12 | Filter Tasks | Filter tasks by status | Only matching tasks displayed | Only matching tasks displayed | ✅ Pass |
| TC-13 | Dashboard | View task statistics and completion chart | Chart and stats displayed correctly | Chart and stats displayed correctly | ✅ Pass |
| TC-14 | Upcoming Deadlines | View tasks with approaching deadlines | Deadline tasks listed correctly | Deadline tasks listed correctly | ✅ Pass |
| TC-15 | Dark / Light Mode | Toggle between dark and light mode | Theme switches correctly | Theme switches correctly | ✅ Pass |
| TC-16 | Logout | Logout with confirmation modal | User logged out and redirected | User logged out and redirected | ✅ Pass |
| TC-17 | Logout | Cancel logout on confirmation modal | User remains logged in | User remains logged in | ✅ Pass |

---

## Summary

| Total Test Cases | Passed | Failed |
|-----------------|--------|--------|
| 17 | 17 | 0 |

---

## Conclusion

All 17 test cases passed successfully across Google Chrome, Microsoft Edge, and Mozilla Firefox. The Event Flow application is fully functional with no bugs or errors detected during testing.
