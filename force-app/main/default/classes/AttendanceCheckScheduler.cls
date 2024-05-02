global class AttendanceCheckScheduler implements Schedulable {

    global void execute(SchedulableContext sc) {
        Integer currentDay = Date.today().day();
        String currentDayString = 'Day_' + String.valueOf(currentDay) + '__c';
        String query = 'SELECT Id, Name, Store_In_Out_Time__c FROM Attendance__c WHERE ' + currentDayString + ' = false';
        List<Attendance__c> attendanceList = Database.query(query);
        List<Attendance__c> attendanceListToUpdate = new List<Attendance__c>();
        for(Attendance__c att : attendanceList) {
            if(att.Store_In_Out_Time__c != null) {
                
            }
        }
    }
}