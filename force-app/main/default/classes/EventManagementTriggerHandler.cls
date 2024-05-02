public class EventManagementTriggerHandler {
    
    public static void validateNameBeforeInsert(List<Event_Management__c> eventList) {
        String eventName = '';
        for(Event_Management__c evt : eventList) {
            if(evt.Name != ' ' && evt.Name == 'Holidays' ) {
                eventName = evt.Name;
            }
        }
        
        List<Event_Management__c> eventLists = [SELECT Id, Name FROM Event_Management__c WHERE Name =: eventName];
        for(Event_Management__c evt : eventList) {
            if(evt.Name != ' ' && evt.Name == 'Holidays') {
                if(!eventLists.isEmpty()) {
                    evt.Name.addError('You cannot create the record name as Holidays.');
                }
            }
        }
    }
    
    
    public static void validateNameBeforeUpdate(List<Event_Management__c> eventList, Map<Id, Event_Management__c> eventMap) {
        String eventName = '';
        for(Event_Management__c evt : eventList) {
            if(evt.Name != ' ' && evt.Name != 'Holidays' && eventMap.get(evt.Id).Name == 'Holidays') {
                evt.Name.addError('You cannot change the Name of that Holidays record.');
            }
            if(eventMap.get(evt.Id).Name != null && evt.Name == 'Holidays') {
                eventName = evt.Name;
            }
        }
        
        List<Event_Management__c> eventLists = [SELECT Id, Name FROM Event_Management__c WHERE Name =: eventName];
        for(Event_Management__c evt : eventList) {
            if(eventMap.get(evt.Id).Name != 'Holidays' && evt.Name == 'Holidays' && !eventLists.isEmpty()) {
                evt.Name.addError('You cannot update the record name as Holidays.');
            }
        }
    }
    
    
    public static void validateNameBeforeDelete(List<Event_Management__c> eventList) {
        for(Event_Management__c evt : eventList) {
            if(evt.Name != ' ' && evt.Name == 'Holidays') {
                evt.Name.addError('You cannot delete the Holidays record.');
            }
        }
    }
    
    public static void CreateEventRecordAndHoliday(List<Event_Management__c> eventRecords) {
        List<Holiday__c> holidayRecords = new List<Holiday__c>();
        
        for (Event_Management__c evt : eventRecords) {
            Holiday__c holidayRec = new Holiday__c();
            holidayRec.Name = evt.Name;
            holidayRec.Date__c = evt.Date__c;
            holidayRec.Year__c = String.valueOf(evt.Date__c.year());
            holidayRec.Event_Management__c = evt.Id;
            holidayRecords.add(holidayRec);
        }
        
        insert holidayRecords;
    }
    
    public static void CreateEventRecordAndHoliday(List<Event_Management__c> eventRecords, Map<Id, Event_Management__c> oldEventMap) {
        List<Holiday__c> holidayRecords = new List<Holiday__c>();
        Set<Id> holidayIds = new Set<Id>();
        string EventName = '';
        Date EventDate;
        for (Event_Management__c newEvt : eventRecords) {
            Event_Management__c oldEvt = oldEventMap.get(newEvt.Id);
            if (newEvt.Name != oldEvt.Name || newEvt.Date__c != oldEvt.Date__c) {
                holidayIds.add(newEvt.Id);
                EventName = newEvt.Name;
                EventDate = newEvt.Date__c;
            }
            
            List<Holiday__c> holidayList = [SELECT Id, Date__c, Day__c, Year__c, Type__c, Event_Management__c, Name FROM Holiday__c WHERE Event_Management__c IN: holidayIds];
            for(Holiday__c holidayObj : holidayList){
                holidayObj.Name = EventName;
                holidayObj.Date__c = EventDate;
            }
            if(!holidayList.isEmpty()){
                update holidayList;
            }
        }
    }
}