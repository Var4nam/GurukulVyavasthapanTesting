@isTest
private class PreventDuplicateRecordsOnClassHandlerT {
    
    @testSetup
    static void preventDuplicacyOnClass() {
        Account  accountObj =  DataFactory.createAccountRecord(true);
        Class__c clsObj = DataFactory.createClassRecord(accountObj.Id,True);
        Class__c classObj = DataFactory.createClassDuplicateRecords(accountObj.Id,True);
    }
    
    @isTest
    static void PreventDuplicateRecordsOfClass() {
        Class__c classObj = [SELECT Id FROM Class__c LIMIT 1];
        classObj.Name = 'test Data';
        UPDATE classObj;
    }
}