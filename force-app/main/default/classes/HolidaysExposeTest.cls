@isTest
private class HolidaysExposeTest {

    @isTest
    static void getHoliday() {
        Test.startTest();
        List<Holiday__c> results = HolidaysExpose.getHolidayRecords();
        Test.stopTest();
        System.assertNotEquals(null, results, 'List of holidays should not be null');
    }
}