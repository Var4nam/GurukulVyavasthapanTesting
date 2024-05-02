@isTest
public class TeacherDetailsControllerTest {

    @isTest
    static void testTeacherDetailsController(){
        
        Account accRecord = new Account(Name = 'Test Account');
        INSERT accRecord;
        
        Teacher__c testTeacher = new Teacher__c(Name ='Test Teacher', First_Name__c = 'TestFirstName', School__c = accRecord.Id
                                              ,Gender__c = 'Male'
                                               , Profile__c = 'Teacher', Email__c = 'prem@aifly.io', Role__c = 'System administrator');
        INSERT testTeacher;
        
        Test.startTest();
        String result = TeacherDetailsController.getTeacherRecord(testTeacher.Id);
        String decryptedData = TeacherDetailsController.decryptedData(testTeacher.Id);
        Test.stopTest();
        
        System.assertEquals('TestFirstName', result, 'Incorrect teacher name returned');
       
    }
   
}