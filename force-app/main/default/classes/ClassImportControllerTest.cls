/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 04-29-2024
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
@isTest
public class ClassImportControllerTest {
        
    @isTest()
    static void testSaveFile() {
        Account testSchool = DataFactory.createAccountRecord(true);
        
        String base64Data = 'Name,Room Number,Section,School Name\n' +
            'John,2,A1,Test School';
        
        Test.startTest();
        List<Class__c> savedClasses = ClassImportController.saveFile(base64Data);
        Test.stopTest();
        
        System.assertNotEquals(0, savedClasses.size(), 'No classes were inserted');    
        Class__c savedClass = savedClasses[0];
        System.assertEquals('John', savedClass.Name, 'Unexpected class name');
        System.assertEquals(2, savedClass.Room_Number__c, 'Unexpected room number');
        System.assertEquals('A1', savedClass.Section__c, 'Unexpected section');
        System.assertEquals(testSchool.Id, savedClass.School__c, 'Incorrect school ID');
    }
}