
package com.settribe.employee_leave.dto;

import com.settribe.employee_leave.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;

public class LeaveStatusUpdateDto {

    @NotNull
    private LeaveStatus status;

    public LeaveStatus getStatus() {
        return status;
    }

    public void setStatus(LeaveStatus status) {
        this.status = status;
    }
}
