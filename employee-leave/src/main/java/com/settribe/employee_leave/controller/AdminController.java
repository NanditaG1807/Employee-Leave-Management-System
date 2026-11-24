package com.settribe.employee_leave.controller;


import com.settribe.employee_leave.entity.LeaveRequest;
import com.settribe.employee_leave.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

import com.settribe.employee_leave.dto.LeaveStatusUpdateDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/api/admin/leaves")
public class AdminController {

    private final LeaveService leaveService;

    public AdminController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    // GET - Admin View All Leaves
    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {

        List<LeaveRequest> leaves =
                leaveService.getAllLeaves();

        return ResponseEntity.ok(leaves);
    }
    // ADMIN - Dashboard Statistics
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {

        Map<String, Long> stats =
                leaveService.getDashboardStats();

        return ResponseEntity.ok(stats);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateLeaveStatus(
            @PathVariable Long id,
            @Valid @RequestBody LeaveStatusUpdateDto dto) {

        LeaveRequest updatedLeave =
                leaveService.updateLeaveStatus(
                        id, dto.getStatus());

        return ResponseEntity.ok(updatedLeave);
    }

}

