public class AttendanceTriggerHandler {
    
    public static void teacherIsPresent(List<Attendance__c> newRecords) {
        Integer currentDay = Date.today().day();

        for (Attendance__c record : newRecords) {
            if (shouldProcessAttendance(record, currentDay)) {
                updateAttendanceRecord(record, currentDay);
            }
        }
    }

    private static Boolean shouldProcessAttendance(Attendance__c record, Integer currentDay) {
        return (record != null &&
                record.Sign_In_Time__c != null &&
                record.Sign_Out_Time__c != null &&
                record.Working_Hour__c != null &&
                (Boolean)record.get('Day_' + currentDay + '__c'));
    }

    private static void updateAttendanceRecord(Attendance__c record, Integer currentDay) {
        String signIn = String.valueOf(record.Sign_In_Time__c);
        String signOut = String.valueOf(record.Sign_Out_Time__c);
        Decimal workingHour = record.Working_Hour__c;

        List<Object> oldStoreTimeFieldvalue = getOldStoreTimeFieldValue(record);
        
        Boolean dayFound = false;
        for (Object obj : oldStoreTimeFieldvalue) {
            Map<String, Object> dailyData = (Map<String, Object>) obj;
            if (dailyData.get('Day').equals(String.valueOf(currentDay))) {
                dailyData.put('SI', signIn);
                dailyData.put('SO', signOut);
                dailyData.put('WH', String.valueOf(workingHour));
                dayFound = true;
                break;
            }
        }

        if (!dayFound) {
            Map<String, Object> dailyData = new Map<String, Object>{
                'Day' => String.valueOf(currentDay),
                'SI' => signIn,
                'SO' => signOut,
                'WH' => String.valueOf(workingHour)
            };
            oldStoreTimeFieldvalue.add(dailyData);
        }

        record.Store_In_Out_Time__c = JSON.serializePretty(oldStoreTimeFieldvalue);
    }

    private static List<Object> getOldStoreTimeFieldValue(Attendance__c record) {
        List<Object> oldStoreTimeFieldvalue = new List<Object>();
        if (record.Store_In_Out_Time__c != null) {
            oldStoreTimeFieldvalue = (List<Object>) JSON.deserializeUntyped(record.Store_In_Out_Time__c);
        }
        return oldStoreTimeFieldvalue;
    }
}