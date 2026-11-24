
package com.settribe.employee_leave.controller;

import com.settribe.employee_leave.dto.LeaveRequestDto;
import com.settribe.employee_leave.entity.User;
import com.settribe.employee_leave.entity.LeaveRequest;
import com.settribe.employee_leave.service.LeaveService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:5173")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }


    @PostMapping
    public ResponseEntity<?> applyLeave(
            @Valid @RequestBody LeaveRequestDto dto,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        LeaveRequest leave = leaveService.applyLeave(dto, user);

        return ResponseEntity.status(201).body(leave);
    }


    // GET Employee Leaves
    @GetMapping
    public ResponseEntity<?> getMyLeaves(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        List<LeaveRequest> leaves =
                leaveService.getMyLeaves(user);

        return ResponseEntity.ok(leaves);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateLeave(
            @PathVariable Long id,
            @Valid @RequestBody LeaveRequestDto dto,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        LeaveRequest updatedLeave =
                leaveService.updateLeave(id, dto, user);

        return ResponseEntity.ok(updatedLeave);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLeave(
            @PathVariable Long id,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        leaveService.deleteLeave(id, user);

        return ResponseEntity.noContent().build();
    }

}
