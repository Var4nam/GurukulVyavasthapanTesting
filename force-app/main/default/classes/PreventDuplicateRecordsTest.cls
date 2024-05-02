@isTest
private class PreventDuplicateRecordsTest {
    @isTest
    static void testPreventDuplicateRecords() {
        // Test case with only new records
        testPreventDuplicateRecordsWithOnlyNewRecords();

        // Test case with both new and old records
        testPreventDuplicateRecordsWithNewAndOldRecords();
    }

    static void testPreventDuplicateRecordsWithOnlyNewRecords() {
        
        Account schRecord = new Account();
        schRecord.Name = 'test';
        Insert schRecord;
        
        List<Class__c> newRecords = new List<Class__c>();
        Class__c newRecord = new Class__c(Name = 'Test Class', Section__c = 'A', School__c = schRecord.Id);
        insert newRecord;
        newRecords.add(newRecord);

        // Call the method
        Test.startTest();
        ForPreventDuplicacyOnClassHandler.PreventDuplicateRecords(newRecords);
        Test.stopTest();

        // Verify that the error message is added to the record
        System.assertEquals('A record with the same Name, Section, and School already exists.', newRecord.getErrors()[0].getMessage());
    }
    
    @isTest
    static void testPreventDuplicateRecordsWithNewAndOldRecords() {
        // Create test data - both new and old records
        
        Account schRecord = new Account();
        schRecord.Name = 'test';
        Insert schRecord;
        
        List<Class__c> newRecords = new List<Class__c>();
        Class__c newRecord = new Class__c(Name = 'Test Class', Section__c = 'A', School__c = schRecord.Id);
        insert newRecord;
        newRecords.add(newRecord);

        // Create old records
        Map<Id, Class__c> oldRecordsMap = new Map<Id, Class__c>();
        Class__c oldRecord = new Class__c(Name = 'Test Class', Section__c = 'A', School__c = schRecord.Id);
        insert oldRecord;
        oldRecordsMap.put(oldRecord.Id, oldRecord);

       /* // Call the method
        Test.startTest();
        ForPreventDuplicacyOnClassHandler.PreventDuplicateRecords(newRecords, oldRecordsMap);
        Test.stopTest();

        // Verify that the error message is added to the new record
        System.assertEquals(newRecord.getErrors()[0].getMessage());*/
    }
}