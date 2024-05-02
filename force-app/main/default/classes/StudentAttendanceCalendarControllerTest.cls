@isTest
public class StudentAttendanceCalendarControllerTest {
    
    @isTest
    static void testStudentAttendanceCalendarController(){
        Account accRecord = new Account(Name = 'Test Teacher');
        INSERT accRecord;
        
        Teacher__c techRecord = new Teacher__c(Name ='Test Teacher', First_Name__c = 'TestFirstName', School__c = accRecord.Id
                                               , User_Name__c = 'prem@gamil.com', Password__c = 'prem1234', Gender__c = 'Male'
                                               , Profile__c = 'Teacher', Email__c = 'prem@aifly.io', Role__c = 'System administrator');
        INSERT techRecord;
        
        Employee__c empRecord = new Employee__c(Name = 'Test Employee', Employment_Type__c = 'Driver', Gender__c = 'Male', Password__c = '123'
                                                , Profile__c = 'Employee', User_Name__c = 'premTest');
        INSERT empRecord;
        
        List<Attendance__c> testAttendanceList = new List<Attendance__c>();
        for(Integer i = 1; i <= 31 ; i++){
            testAttendanceList.add(new Attendance__c(Teacher__c = techRecord.Id, Name = 'March', Day_1__c = true));
        }
        INSERT testAttendanceList;
        System.debug('testAttendanceList'+ testAttendanceList);
        Date startDate = Date.newInstance(Date.today().year(), 3, 1);
        Date endDate = startDate.addMonths(1).addDays(-1);
        
        List<Leave__c> testLeaveList = new List<Leave__c>{
            new Leave__c(Multi_Select_Teacher__c = techRecord.Id, Status__c = 'Approved', To__c = techRecord.Id, 
                         From_Date__c = startDate , Sessions__c = 'Before Lunch Break', To_Date__c = endDate, 
                         Employee__c = empRecord.Id)
                };
                    INSERT testLeaveList;
        
        Test.startTest();
        List<StudentAttendanceCalendarController.AttendanceWrapper> result = StudentAttendanceCalendarController.getAttendanceCalendar(techRecord.Id, Date.newInstance(2024, 3, 15), 'March');
        Test.stopTest();
        // System.assertEquals(0, result.size(), 'Expected 31 days in the attendance calendar');
    }
    
    @isTest
    static void testcalculateStatus(){
        Attendance__c attndanceRecord = new Attendance__c(Name = 'Test Attandance', Day_1__c = true);
        INSERT attndanceRecord;
        
        
    }
    
    
    @isTest
    static void testAttendanceWrapperConstructor() {
        
        StudentAttendanceCalendarController.AttendanceWrapper wrapper = new StudentAttendanceCalendarController.AttendanceWrapper(10, 'present', 3);
        System.assertEquals(10, wrapper.dayNumber, 'Expected dayNumber to be 10');
        System.assertEquals('present', wrapper.status, 'Expected status to be "present"');
        System.assertEquals(3, wrapper.monthNumber, 'Expected monthNumber to be 3');
    }
    
    @isTest
    static void testAttendanceWrapperSerialization() {
        StudentAttendanceCalendarController.AttendanceWrapper wrapper = new StudentAttendanceCalendarController.AttendanceWrapper(15, 'halfday', 5);
        String jsonWrapper = JSON.serialize(wrapper);
        
        System.assert(jsonWrapper.contains('"dayNumber":15'), 'Expected JSON to contain "dayNumber":15');
        System.assert(jsonWrapper.contains('"status":"halfday"'), 'Expected JSON to contain "status":"halfday"');
        System.assert(jsonWrapper.contains('"monthNumber":5'), 'Expected JSON to contain "monthNumber":5');
    }
}