@isTest
private class TeacherLoginControllerTest {

    /*@TestSetup
    public static void testDataSetup(){
        Account schools = DataFactory.createAccountRecord(true);
        Teacher__c teachers = DataFactory.createTeacherRecord(schools.Id, true);
    }
    
    @isTest
    static void testValidateLogin() {
        Teacher__c testTeacher = [
            SELECT User_Name__c, Password__c 
            FROM Teacher__c 
            WHERE First_Name__c = 'Test'
            LIMIT 1
        ];
        System.debug('testTeacher ::: '+testTeacher);
        Test.startTest();
        String result = TeacherLoginController.validateLogin(testTeacher.User_Name__c, testTeacher.Password__c);
        Test.stopTest();
        System.assertNotEquals(result, null);
    }*/
}