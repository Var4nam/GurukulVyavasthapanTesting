@isTest
private class HolidayIntegretionControllerTest {
    
    @isTest
    static void testGetHolidayRecord() {
        String country = 'India';
        String year = '2025';
        
        Test.setMock(HttpCalloutMock.class, new MockHttpResponseGenerator());
        
        Test.startTest();
        List<Object> results = HolidayIntegretionController.getHolidayRecord(country, year);
        Test.stopTest();
        
        System.assertEquals(new List<Object>(), results);
    }
    
    @isTest
    static void testCreateHolidaysRecord() {
        
        Event_Management__c evt = DataFactory.createEventManagementRecord('Holidays', true);
        
        List<Holiday__c> holList = new List<Holiday__c>();
        Holiday__c hol = DataFactory.createHolidayRecord('Ganesh Chaturthi/Vinayaka Chaturth', 'RESTRICTED_HOLIDAY', 'Wednesday', '2025', true, evt.Id);
        holList.add(hol);
        
        Test.startTest();
        String result = HolidayIntegretionController.createHolidaysRecord(holList);
        Test.stopTest();
        
        System.assertEquals('Error', result);
        List<Holiday__c> insertedHolidays = [SELECT Id FROM Holiday__c];
        System.assertNotEquals(0, insertedHolidays.size(), 'No holidays were inserted.');
        
    }
    
    @isTest
    static void testCreateHolidaysRecordWithExistingRecords() {
        
        Event_Management__c evt = DataFactory.createEventManagementRecord('Holidays', true);
        
        List<Holiday__c> holList = new List<Holiday__c>();
        Holiday__c hol1 = DataFactory.createHolidayRecord('Ganesh Chaturthi/Vinayaka Chaturth', 'RESTRICTED_HOLIDAY', 'Wednesday', '2025', true, evt.Id);
        
        holList.add(hol1);
        Holiday__c hol2 = DataFactory.createHolidayRecord('Existing Holiday', 'RESTRICTED_HOLIDAY', 'Wednesday', '2025', true, evt.Id);
        
        Test.startTest();
        String result = HolidayIntegretionController.createHolidaysRecord(holList);
        Test.stopTest();
        
        System.assertEquals('Error', result);
        List<Holiday__c> insertedHolidays = [SELECT Id FROM Holiday__c];
        System.assertEquals(3, insertedHolidays.size(), 'Duplicate holidays were inserted.');
    }
    
    public class MockHttpResponseGenerator implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest request) {
            HttpResponse response = new HttpResponse();
            response.setStatusCode(200);
            response.setBody('[]'); 
            return response;
        }
    }
}