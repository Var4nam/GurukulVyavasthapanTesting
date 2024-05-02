@isTest
public class AttendanceSchedulerForTeacherTest {
/*
    @isTest
    static void testExecute(){
        List<Attendance__c> testAttendaceList = new List<Attendance__c>{
            new Attendance__c(Sign_In_Time__c = DateTime.now(), Sign_Out_Time__c = DateTime.now().addHours(1)),
            new Attendance__c(Sign_In_Time__c = DateTime.now(), Sign_Out_Time__c = DateTime.now().addHours(1))
                
        };
          INSERT testAttendaceList;
            
         Test.startTest();
        AttendanceSchedulerForTeacher scheduler = new AttendanceSchedulerForTeacher();
        scheduler.execute(null);
        Test.stopTest();
        
        List<Attendance__c> updateAttandanceList = [SELECT Id, Sign_In_Time__c, Sign_Out_Time__c FROM Attendance__c];
        for(Attendance__c attandance : updateAttandanceList){
            System.assertEquals(null, attandance.Sign_In_Time__c, 'Expected Sign_In_Time__c to be null');
            System.assertEquals(null, attandance.Sign_Out_Time__c, 'Expected Sign_Out_Time__c to be null');
        }
    }*/
}