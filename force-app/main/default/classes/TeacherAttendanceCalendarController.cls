public without sharing class TeacherAttendanceCalendarController {

    @AuraEnabled(cacheable=true)
    public static List<AttendanceWrapper> getAttendanceCalendar(String teacherId, String studentId, String staffId, DateTime selectedDate, String monthName) {
        Integer monthNumber = selectedDate.Month();
        Integer todayNumber = Date.today().day();
        Integer daysInMonth = Date.today().addMonths(1).toStartOfMonth().addDays(-1).day();
        Date startDate = Date.newInstance(Date.today().year(), monthNumber, 1);
        Date endDate = startDate.addMonths(1).addDays(-1);
        List<Attendance__c> attendanceList = new List<Attendance__c>(); 
        List<AttendanceWrapper> result = new List<AttendanceWrapper>();
        List<Leave__c> leaveList = new List<Leave__c>();
        if(teacherId != '' ) {
            leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE To__c = :teacherId AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
            attendanceList = [SELECT Id, Store_In_Out_Time__c FROM Attendance__c WHERE Teacher__c = :teacherId AND Name =: monthName];
        	if(!attendanceList.isEmpty() && attendanceList[0].Store_In_Out_Time__c != null) {
                String jsonString = attendanceList[0].Store_In_Out_Time__c;
                List<JsonFieldData> myDataList = (List<JsonFieldData>) JSON.deserialize(jsonString, List<JsonFieldData>.class);
                for(Integer i = 1; i <= daysInMonth; i++) {
                    String fieldApiName = 'Day_'+ i + '__c';
                    Integer dayNumber = i; 
                    String status = calculateStatusForTeacherStaff(myDataList, fieldApiName, todayNumber, dayNumber);
                    result.add(new AttendanceWrapper(dayNumber, status, monthNumber));
                }
            }
        } 
        else if(staffId != '' ) {
            leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE To__c =: staffId AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
            attendanceList = [SELECT Id, Store_In_Out_Time__c FROM Attendance__c WHERE Staff__c =: staffId AND Name =: monthName];
        	if(!attendanceList.isEmpty() && attendanceList[0].Store_In_Out_Time__c != null) {
                String jsonString = attendanceList[0].Store_In_Out_Time__c;
                List<JsonFieldData> myDataList = (List<JsonFieldData>) JSON.deserialize(jsonString, List<JsonFieldData>.class);
                for(Integer i = 1; i <= daysInMonth; i++) {
                    String fieldApiName = 'Day_'+ i + '__c';
                    Integer dayNumber = i; 
                    String status = calculateStatusForTeacherStaff(myDataList, fieldApiName, todayNumber, dayNumber);
                    result.add(new AttendanceWrapper(dayNumber, status, monthNumber));
                }
            }
        } 
        else if(studentId != '' ) {
            leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE (To__c = :teacherId OR To__c =: staffId) AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
            attendanceList = [SELECT Id, Student__c, Class__c, Name, Day_1__c, Day_2__c, Day_3__c, Day_4__c, Day_5__c, Day_6__c, Day_7__c, Day_8__c, Day_10__c, Day_9__c, Day_11__c, Day_13__c, Day_12__c, Day_14__c, Day_16__c, Day_15__c, Day_17__c, Day_18__c, Day_19__c, Day_20__c, Day_21__c, Day_22__c, Day_23__c, Day_24__c, Day_25__c, Day_26__c, Day_27__c, Day_29__c, Day_28__c, Day_30__c, Day_31__c, Date__c FROM Attendance__c WHERE Student__c =: studentId AND Name =: monthName];
        	if(!attendanceList.isEmpty()) {
                for(Integer i = 1; i <= daysInMonth; i++) {
                    String fieldApiName = 'Day_'+ i + '__c';
                    Integer dayNumber = i; 
                    String status = calculateStatusForStudent(attendanceList[0], fieldApiName, todayNumber, dayNumber);
                    result.add(new AttendanceWrapper(dayNumber, status, monthNumber));
                }
            }
        }  
        if(!leaveList.isEmpty()) {
            for (Leave__c leaveObj : leaveList) {
                Integer dayNumber = leaveObj.From_Date__c.day();
                String status = 'leave-a';
                for (Integer i = 0; i <= leaveObj.Leave_Days__c; i++) {
                    result.add(new AttendanceWrapper(dayNumber, status, monthNumber));
                    dayNumber++;
                }
            }
        }
        System.debug('result :::: '+result);
        return result;
    }
    
    private static String calculateStatusForTeacherStaff(List<JsonFieldData> myDataList, String day, Integer todayNumber, Integer dayNumber) {
        for(JsonFieldData jfd : myDataList) {
            Integer workingHour = Integer.valueOf(jfd.WH);
            String fieldApiName = 'Day_'+ jfd.Day + '__c';
            if(day == fieldApiName) {
                if(dayNumber <= todayNumber) {
                    if(workingHour == null || workingHour == 0) {
                        return 'absent';
                    } else if (workingHour > 0 && workingHour <= 4) {
                        return 'halfday';
                    } else if(workingHour > 4) {
                        return 'present';
                    } 
                }
            }             
        }
        return null;
    }
    
    private static String calculateStatusForStudent(Attendance__c attendance, String day, Integer todayNumber, Integer dayNumber) {
        Boolean isPresent = (Boolean)attendance.get(day);
        if(dayNumber <= todayNumber) {
            if (!isPresent) {
            	return 'absent';
            } else {
                return 'present';
            } 
        }
        return null;
    }
    
    public class JsonFieldData {
        public String WH;
        public String Day;
        public String SO;
        public String SI;
    }
    
    public class AttendanceWrapper {
        @AuraEnabled
        public Integer dayNumber;
        @AuraEnabled
        public Integer monthNumber;
        @AuraEnabled
        public String status;
        
        public AttendanceWrapper(Integer dayNumber, String status, Integer monthNumber) {
            this.dayNumber = dayNumber;
            this.status = status;
            this.monthNumber = monthNumber;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<CalculateAttendanceWrapper> getAttendance(String teacherId, String studentId, String staffId, DateTime selectedDate, String monthName) {
        System.debug('teacherId :::: '+teacherId);
        Integer daysInMonth = Date.today().addMonths(1).toStartOfMonth().addDays(-1).day();
        Integer monthNumber = selectedDate.Month();
        Date startDate = Date.newInstance(Date.today().year(), monthNumber, 1);
        Date endDate = startDate.addMonths(1).addDays(-1);
        List<Attendance__c> attendanceList = new List<Attendance__c>(); 
        List<Leave__c> leaveList = new List<Leave__c>();
        List<CalculateAttendanceWrapper> result = new List<CalculateAttendanceWrapper>();
        if(teacherId != '' ) {
            System.debug('in');
            leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE To__c = :teacherId AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
            attendanceList = [SELECT Id, Store_In_Out_Time__c FROM Attendance__c WHERE Teacher__c = :teacherId AND Name =: monthName LIMIT 1];
            Integer countPresent = 0;
            Integer countAbsent = 0;
            Integer countHalfday = 0;
            Integer countLeave = (leaveList.size() > 0)?leaveList.size():0;
            
            if (attendanceList.size() > 0 && attendanceList[0].Store_In_Out_Time__c != null) {
                String jsonString = attendanceList[0].Store_In_Out_Time__c;
                List<JsonFieldData> myDataList = (List<JsonFieldData>) JSON.deserialize(jsonString, List<JsonFieldData>.class);
                for(JsonFieldData jfd : myDataList) {
                    Integer workingHour = Integer.valueOf(jfd.WH);
                    System.debug('workingHour :::: '+workingHour);
                    if(workingHour == null || workingHour == 0) {
                        countAbsent++;
                    } else if (workingHour > 0 && workingHour <= 4) {
                        countHalfday++;
                    } else if(workingHour > 4) {
                        countPresent++;
                    } 
                }
            }
            result.add(new CalculateAttendanceWrapper(countPresent, countAbsent, countHalfday, countLeave));
        } 
        else if(staffId != '' ) {
            leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE To__c =: staffId AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
            attendanceList = [SELECT Id, Store_In_Out_Time__c FROM Attendance__c WHERE Staff__c =: staffId AND Name =: monthName LIMIT 1];
        	Integer countPresent = 0;
            Integer countAbsent = 0;
            Integer countHalfday = 0;
            Integer countLeave = (leaveList.size() > 0)?leaveList.size():0;
            
            if (attendanceList.size() > 0 && attendanceList[0].Store_In_Out_Time__c != null) {
                String jsonString = attendanceList[0].Store_In_Out_Time__c;
                List<JsonFieldData> myDataList = (List<JsonFieldData>) JSON.deserialize(jsonString, List<JsonFieldData>.class);
                for(JsonFieldData jfd : myDataList) {
                    Integer workingHour = Integer.valueOf(jfd.WH);
                    System.debug('workingHour :::: '+workingHour);
                    if(workingHour == null || workingHour == 0) {
                        countAbsent++;
                    } else if (workingHour > 0 && workingHour <= 4) {
                        countHalfday++;
                    } else if(workingHour > 4) {
                        countPresent++;
                    } 
                }
            }
            result.add(new CalculateAttendanceWrapper(countPresent, countAbsent, countHalfday, countLeave));
        } 
        else if(studentId != '' ) {
            leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE (To__c = :teacherId OR To__c =: staffId) AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
            attendanceList = [SELECT Id, Student__c, Class__c, Name, Day_1__c, Day_2__c, Day_3__c, Day_4__c, Day_5__c, Day_6__c, Day_7__c, Day_8__c, Day_10__c, Day_9__c, Day_11__c, Day_13__c, Day_12__c, Day_14__c, Day_16__c, Day_15__c, Day_17__c, Day_18__c, Day_19__c, Day_20__c, Day_21__c, Day_22__c, Day_23__c, Day_24__c, Day_25__c, Day_26__c, Day_27__c, Day_29__c, Day_28__c, Day_30__c, Day_31__c, Date__c FROM Attendance__c WHERE Student__c =: studentId AND Name =: monthName LIMIT 1];
        	Integer countPresent = 0;
            Integer countAbsent = 0;
            Integer countHalfday = 0;
            Integer countLeave = (leaveList.size() > 0)?leaveList.size():0;
            
            if (attendanceList.size() > 0) {
                for(Integer i = 1; i <= daysInMonth; i++) {
                    String fieldApiName = 'Day_'+ i + '__c';
                    if(attendanceList[0].get(fieldApiName) == true) {
                        countPresent++;
                    } else {
                        countAbsent++;
                    }
                }
            }
            result.add(new CalculateAttendanceWrapper(countPresent, countAbsent, countHalfday, countLeave));
        }
        System.debug('student result --->>> '+result);
        return result;
    }
    
    public class CalculateAttendanceWrapper {
        
        @AuraEnabled
        public Integer countPresent;
        @AuraEnabled
        public Integer countAbsent;
        @AuraEnabled
        public Integer countHalfday;
        @AuraEnabled
        public Integer countLeave;
        
        public CalculateAttendanceWrapper(Integer countPresent, Integer countAbsent, Integer countHalfday, Integer countLeave) {
            this.countPresent = countPresent;
            this.countAbsent = countAbsent;
            this.countHalfday = countHalfday;
            this.countLeave = countLeave;
        }
    }
}