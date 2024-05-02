@isTest
public class TimeTableTriggerHandlerTest {
    
    @testSetup 
    static void testSetup() {
       
        Teacher__c teacherObj = DataFactory.createTeacherRecord('Test', True);
        
        Account SchoolObj = DataFactory.createAccountRecord(True);
        
        Class__c classObj = DataFactory.createClassRecord(SchoolObj.Id, True);
        
        TimeTable__c testRecords = DataFactory.createTimeTableRecord(classObj.Id, teacherObj.Id, true);
    }
    
    @isTest
    static void testTreachIsPresent() {
        List<TimeTable__c> testRecords = [SELECT Id, Teacher__c, Class__c, Day__c, Period__c FROM TimeTable__c];
        Test.startTest();
        TimeTableTriggerHandler.teacherIsPresent(testRecords);
        Test.stopTest();
    }
}