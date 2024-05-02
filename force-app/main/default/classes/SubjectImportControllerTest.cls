@isTest
public class SubjectImportControllerTest { 
    
    @isTest
    static void testSaveFile() {
        Account testSchool = DataFactory.createAccountRecord(True);
        
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, True);
        
        String base64Data = 'Name,Class,Subject_Code__c\n' +
            'John,Test Class,Eng-101';
        
        Test.startTest();
        List<Subject__c> savedSubjects = SubjectImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertNotEquals(0, savedSubjects.size(), 'No subjects were inserted');
        
        Subject__c savedSubject = savedSubjects[0];
        System.assertEquals('John', savedSubject.Name);
        //System.assertEquals(testClass.Id, savedSubject.Class__c);
        System.assertEquals('Eng-101', savedSubject.Subject_Code__c);
    }
}