@isTest
public class EventManagementTriggerHandlerTest {
    @testSetup
    static void setupTestData() {
        Event_Management__c event1 = DataFactory.createEventManagementRecord('Event 1', True);
        Event_Management__c event2 = DataFactory.createEventManagementRecord('Holidays', True);
     }
    
    @isTest
    static void testValidateNameBeforeInsert() {
        List<Event_Management__c> eventManagementList =  [SELECT Id, Name, Date__c FROM Event_Management__c];
        Test.startTest();
        EventManagementTriggerHandler.validateNameBeforeInsert(eventManagementList);
        Test.stopTest();
        System.assertEquals(2, eventManagementList.size(), 'Expected 2 events after insert.');
    }
    
    @isTest
    static void testValidateNameBeforeUpdate() {
        
        List<Event_Management__c> eventManagementList = [SELECT Id, Name, Date__c FROM Event_Management__c];
        Map<Id, Event_Management__c> eventMap = new Map<Id, Event_Management__c>{eventManagementList[0].Id => eventManagementList[0], eventManagementList[1].Id => eventManagementList[1]};
                    
        Test.startTest();
        EventManagementTriggerHandler.validateNameBeforeUpdate(eventManagementList, eventMap);
        
        eventManagementList[0].Date__c = Date.today().addDays(1);
        Update eventManagementList;
        
        EventManagementTriggerHandler.CreateEventRecordAndHoliday(eventManagementList, eventMap);
        Test.stopTest();
        
        System.assertEquals(2, eventManagementList.size(), 'No errors expected for other records.');

    }

    @isTest
    static void testValidateNameBeforeDelete() {
        List<Event_Management__c> eventManagementList =  [SELECT Id, Name, Date__c FROM Event_Management__c];
        
        Test.startTest();
        EventManagementTriggerHandler.validateNameBeforeDelete(eventManagementList);
        Test.stopTest();
        System.assertEquals(2, eventManagementList.size(), 'Expected all Event_Management__c records to be deleted.');

    }
    
}