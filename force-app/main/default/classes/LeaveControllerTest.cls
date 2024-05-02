@isTest
public class LeaveControllerTest {

    @isTest
    static void testFetchLookupData() {
        Test.startTest();
        List<Account> testAccount = new List<Account>();
        for(Integer i = 0; i < 5; i++) {
            testAccount.add(new Account(Name= 'TestAccount'+i));
        }
        insert testAccount;
        
        List<sObject> result = LeaveController.fetchLookupData('Test','Account');
        Test.stopTest();
        
        System.assertEquals(5, result.size(), 'Expected 5 records to be returned');
    }
    
    @isTest
    static void testFetchDefaultRecord() {
        Test.startTest();
        Account accRecord = DataFactory.createAccountRecord(True);
        
        sObject result = LeaveController.fetchDefaultRecord(accRecord.Id, 'Account');
        Test.stopTest();
        
        System.assertNotEquals(null, result, 'Expected a record to be returned');
        System.assertEquals(accRecord.Id, result.Id, 'Incorrect record returned');
    }
    
    @isTest
    static void testRetriveSearchData() {
        Test.startTest();
        Account testAccount1 = new Account(Name= 'Test Account 1');
        Account testAccount2 = new Account(Name = 'TestAccount2');
        insert new List<Account>{testAccount1, testAccount2};
            
        List<sObject> result = LeaveController.retriveSearchData('Account', 'Name', 'Test', new List<String>());
        Test.stopTest();
        
        System.assertEquals('Test Account 1', ((Account)result[0]).Name, 'Incorrect record returned');
    }
    
    @isTest
    static void testCreateLeaveRecords() {
        Staff__c staffRecord = DataFactory.createStaffRecord(True);
        
        Account accRecord = DataFactory.createAccountRecord(True);
        
        Teacher__c techRecord = DataFactory.createTeacherRecord(accRecord.Id, True);
        
        Leave__c testLeave = DataFactory.createLeaveRecord(techRecord.Id, staffRecord.Id, True);

        Test.startTest();
        LeaveController.createLeaveRecords(testLeave);
        Test.stopTest();

        Integer expectedRecordCount = 1;
        Integer actualRecordCount = [SELECT COUNT() FROM Leave__c];
        System.assertEquals(expectedRecordCount, actualRecordCount, 'Expected 1 Leave record to be inserted');
    }
   
    @isTest
    static void testFetchTotalLeave() {
        Account accRecord = DataFactory.createAccountRecord(True);
         
        Teacher__c testTeacher = DataFactory.createTeacherRecord(accRecord.Id, True);

        Test.startTest();
        LeaveController.LeaveWrapper result = LeaveController.fetchTotalLeave(testTeacher.Id, 'Pending');
        result = LeaveController.fetchTotalLeave(testTeacher.Id, 'Approved');
        Test.stopTest();
        
        System.assertEquals('', result.role, 'Expected role to be empty');
    }
    
    
    /*@isTest
    static void testFetchLeaveRecords() {
        Test.startTest();
        List<Leave__c> testLeaveRecords = new List<Leave__c>{
            new Leave__c(Name = 'Leave 1', Status__c = 'Pending'),
            new Leave__c(Name = 'Leave 2', Status__c = 'Approved')
        };
        insert testLeaveRecords;  // Corrected typo: INSERT to insert
        
        List<Leave__c> result = LeaveController.fetchLeaveRecords('null', 'Pending');
        Test.stopTest();
   }*/
    
    @isTest
    static void testUpdateTotalLeave() {
        Staff__c staffRecord = DataFactory.createStaffRecord(True);
        
        Account schRecord = DataFactory.createAccountRecord(True);
        
        Teacher__c techRecord = DataFactory.createTeacherRecord(schRecord.Id, True);
        
        Leave__c testLeave = DataFactory.createLeaveRecord(techRecord.Id, staffRecord.Id, True);
        
        Test.startTest();
        LeaveController.updateTotalLeave(techRecord.Id, testLeave.Id, 'Approved');
        Test.stopTest();
        
        Leave__c updatedLeave = [SELECT Id, Status__c FROM Leave__c WHERE Id =: testLeave.Id];
        System.assertEquals('Approved', updatedLeave.Status__c, 'Expected Leave status to be updated');
    }
}