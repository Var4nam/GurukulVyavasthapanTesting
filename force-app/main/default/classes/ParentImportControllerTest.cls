@isTest
public class ParentImportControllerTest {
    
    @isTest
    static void testSaveFile() {
        
        Account testSchool = DataFactory.createAccountRecord(true);
        Class__c testClass = DataFactory.createClassRecord(testSchool.Id, true);
        Student__c testStudent1 = DataFactory.createStudentRecord('Test Student', testClass.Id, testSchool.Id, true);
        
        String base64Data = 'Name,Contact Number,Relationship to Student,Student Name\n' +
            'John,2741853960,father,Test Student';
        
        Test.startTest();
        List<Parent_Guardian__c> savedParents = ParentImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertNotEquals(0, savedParents.size(), 'No Parents were inserted');
        
        System.debug('Number of Parents inserted: ' + savedParents.size());
        
        System.debug('Saved Parents: ' + savedParents);
        
        Parent_Guardian__c savedParent = savedParents[0];
        System.assertEquals('John', savedParent.Name);
        System.assertEquals('2741853960', savedParent.Contact_Information__c);
        System.assertEquals('father', savedParent.Relationship_to_Student__c);
        System.assertEquals(testStudent1.Id, savedParent.Student__c);
    }
}