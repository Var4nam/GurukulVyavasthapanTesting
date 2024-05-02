@isTest
public class AssignClassImportControllerTest {
    
    @isTest static void testSaveFile() {
        Account testSchool = DataFactory.createAccountRecord(true);
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, true);
        Subject__c testSubject = DataFactory.createSubjectWithClass(true);
        Teacher__c testTeacher = DataFactory.createTeacherRecord(testSchool.Id, true);
        
        String base64Data = 'Class,Subject,Teacher\n'
            + 'Test Class-A1,Test - 1-(sub-102),Test';

        Test.startTest();
        List<Assign_Classes__c> savedAssignClass = AssignClassImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertEquals(1, savedAssignClass.size(), 'Incorrect number of records saved');
    }
    
    @isTest static void testSaveFileWithMissingData() {
        String base64Data = 'Class,Subject,Teacher\nTest Class,Test Subject,';
        
        Test.startTest();
        List<Assign_Classes__c> savedAssignClass = AssignClassImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertEquals(0, savedAssignClass.size(), 'Records should not be saved with missing data');
    }
    
    @isTest static void testSaveFileWithNonexistentData() {
        String base64Data = 'Class,Subject,Teacher\nNonexistent Class,Nonexistent Subject,Nonexistent Teacher\n';
        
        Test.startTest();
        List<Assign_Classes__c> savedAssignClass = AssignClassImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertEquals(0, savedAssignClass.size(), 'Records should not be saved with nonexistent data');
    }
}