public class StudentAttendanceCalendarController {

    @AuraEnabled(cacheable=true)
    public static List<AttendanceWrapper> getAttendanceCalendar(Id studentId, DateTime selectedDate, String monthName) {
        Integer monthNumber = selectedDate.Month();
        Integer todayNumber = Date.today().day();
        Integer daysInMonth = Date.today().addMonths(1).toStartOfMonth().addDays(-1).day();
        Date startDate = Date.newInstance(Date.today().year(), monthNumber, 1);
        Date endDate = startDate.addMonths(1).addDays(-1);
        
        List<Attendance__c> attendanceList = [SELECT Id, Name, Remarks__c, Class__c, Day_1__c, Day_2__c, Day_3__c, Day_4__c, Day_5__c, Day_6__c, Day_7__c, Day_8__c, Day_9__c, Day_10__c, Day_11__c, Day_12__c, Day_13__c, Day_14__c, Day_15__c, Day_16__c, Day_17__c, Day_18__c, Day_19__c, Day_20__c, Day_21__c, Day_22__c, Day_23__c, Day_24__c, Day_25__c, Day_26__c, Day_27__c, Day_28__c, Day_29__c, Day_30__c, Day_31__c, Date__c, Student__c FROM Attendance__c WHERE Student__c = :studentId AND Name =: monthName AND Student__c != Null];
        List<Leave__c> leaveList = [SELECT Id, From_Date__c, To_Date__c, Leave_Days__c, Name, To__c, CC__c, Status__c FROM Leave__c WHERE To__c = :studentId AND Status__c = 'Approved' AND From_date__c >= :startDate AND To_date__c <= :endDate];
        List<AttendanceWrapper> result = new List<AttendanceWrapper>();
        System.debug('attendanceList ::: '+attendanceList);
        if(!attendanceList.isEmpty()) {
            for(Integer i = 1; i <= daysInMonth; i++) {
                String fieldApiName = 'Day_'+ i + '__c';
                Integer dayNumber = i; 
                String status = calculateStatus(attendanceList[0], fieldApiName, todayNumber, dayNumber);
                System.debug('status :::: '+status);
                result.add(new AttendanceWrapper(dayNumber, status, monthNumber));
            }
        }
        
        for (Leave__c leaveObj : leaveList) {
            Integer dayNumber = leaveObj.From_Date__c.day();
            String status = 'leave-a';
            for (Integer i = 0; i <= leaveObj.Leave_Days__c; i++) {
                result.add(new AttendanceWrapper(dayNumber, status, monthNumber));
                dayNumber++;
            }
        }
        
        return result;
    }
    
    private static String calculateStatus(Attendance__c attendance, String day, Integer todayNumber, Integer dayNumber) {
        System.debug('dayNumber ::: '+dayNumber);
        System.debug('todayNumber ::: '+todayNumber);
        Boolean isPresent = (Boolean)attendance.get(day);
        System.debug('isPresent ::: '+isPresent);
        if(dayNumber <= todayNumber) {
            if (!isPresent) {
            	return 'absent';
            } else {
                return 'present';
            } 
        }
        return null;
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
}