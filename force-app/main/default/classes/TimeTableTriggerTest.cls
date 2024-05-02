@isTest
private class TimeTableTriggerTest {
    @isTest
    static void testTimeTableTriggerHandler() {
        
        Teacher__c teacherObj = DataFactory.createTeacherRecord('Test', True);
        
        Account SchoolObj = DataFactory.createAccountRecord(True);
        
        Class__c classObj = DataFactory.createClassRecord(SchoolObj.Id, True);
        
        TimeTable__c testTimeTable = DataFactory.createTimeTableRecord(classObj.Id, teacherObj.Id, False);
        testTimeTable.Name = 'Test Time Table';
        insert testTimeTable;
        
        testTimeTable.Name = 'Updated Test Time Table';
        
        Test.startTest();
        update testTimeTable;
        Test.stopTest();
    }
}