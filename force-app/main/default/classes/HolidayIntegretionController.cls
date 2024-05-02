public without sharing class HolidayIntegretionController {

    @AuraEnabled(cacheable = true)
    public static List<Object> getHolidayRecord(String country, String year) {
        Http http = new Http();
        HttpRequest request = new HttpRequest ();
        request.setHeader('X-Api-Key', 'IIWAyV4mfFwijcNmZcJyyg==Jy7yyZLGCWKiJrH3');
        String url = 'https://api.api-ninjas.com/v1/holidays?country='+ country +'&year='+ year;
        request.setEndpoint(url);
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if(response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            List<Object> results = (List<Object>) JSON.deserializeUntyped(response.getBody());
            return results;
        }
        return null;
    }
    
    @AuraEnabled
    public static String createHolidaysRecord(List<Holiday__c> holidays) {
        String work = 'Error';
        if(!holidays.isEmpty()) {
            Map<String, List<Holiday__c>> mapOfContryTypeYearAndHoidayList = new Map<String, List<Holiday__c>>();
            Set<String> setOfType = new Set<String>();
            Set<String> setOfYear = new Set<String>();
            List<Event_Management__c> getEventHoliday = [SELECT Id, Name FROM Event_Management__c WHERE Name = 'Holidays' LIMIT 1];
            for(Holiday__c hol : holidays) {
                if(hol.Type__c != null && hol.Year__c != null) {
                    hol.Event_Management__c = getEventHoliday[0].Id;
                    setOfType.add(hol.Type__c);
                    setOfYear.add(hol.Year__c);
                    if(mapOfContryTypeYearAndHoidayList.containsKey(hol.Type__c+'-'+hol.Year__c)) {
                        mapOfContryTypeYearAndHoidayList.get(hol.Type__c+'-'+hol.Year__c).add(hol);
                    } else {
                        List<Holiday__c> listOfHoliday = new List<Holiday__c>();
                        listOfHoliday.add(hol);
                        mapOfContryTypeYearAndHoidayList.put(hol.Type__c+'-'+hol.Year__c,listOfHoliday);
                    }
                }
            }
            List<Holiday__c> holidayListToInsert = new List<Holiday__c>();
            List<Holiday__c> getHolidayRecords = [SELECT Id, Name, Date__c, Type__c, Day__c, Year__c FROM Holiday__c WHERE Year__c IN: setOfYear AND Type__c IN: setOfType];
            if(!getHolidayRecords.isEmpty()) {
                for(Holiday__c hol : getHolidayRecords) {
                    if(hol.Type__c != null && hol.Year__c != null) {
                        String key = hol.Type__c+'-'+hol.Year__c;
                        if(!mapOfContryTypeYearAndHoidayList.containsKey(key)) {
                            holidayListToInsert.add(hol);
                        }
                    }
                }
            } else {
                if(!holidays.isEmpty()) {
                    work = 'Success';
                    insert holidays;
                }
            }
            if(!holidayListToInsert.isEmpty()) {
                work = 'Success';
                insert holidayListToInsert;
            }
        }
        return work;
    }
}