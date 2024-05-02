@isTest
private class ForPreventDuplicacyOnSubjectHandlerTest {
    
    @testSetup static void preventDuplicacyOnSubject() {
        Account  accountObj =  DataFactory.createAccountRecord(true);
        Class__c  classObj =  DataFactory.createClassRecord(accountObj.Id, true);
        Subject__c subjectWithClass = DataFactory.createSubjectWithClass(classObj.Id, true);
        Subject__c duplicateSubjectRecords = DataFactory.createSubjectDuplicateRecords(classObj.Id, true);
    }    
    
    @isTest
    static void PreventDuplicateRecordsOfSubject() {
        Subject__c subjectObj = [SELECT Id FROM Subject__c LIMIT 1];
        subjectObj.Name = 'test Data';
        UPDATE subjectObj;
    }
}