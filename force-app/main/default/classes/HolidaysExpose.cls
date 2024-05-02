@RestResource(urlMapping='/DataAvailable/*')
global class HolidaysExpose {

    @httpGet
    global static List<Holiday__c> getHolidayRecords() {
        return [SELECT Id, Name, Year__c, Type__c, Date__c FROM Holiday__c];
    }
}