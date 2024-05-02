public class FeeManagementTriggerHandler {
    
    public static void storeJSONForFee(List<Fee_Management__c> feeList, Map<Id, Fee_Management__c> oldMapOfFeeManagement) {
        String currentMonth;
		String currentYear;
        String currentMonthYear;
        for(Fee_Management__c fee : feeList) {
            List<String> dateParts = String.valueOf(fee.Date__c).split('-');
            currentYear = dateParts[0]; 
            currentMonth = String.valueOf(Integer.valueOf(dateParts[1]));
            currentMonthYear = currentMonth + ' - ' + currentYear;
            if((fee.Amount__c != null && oldMapOfFeeManagement.get(fee.Id).Amount__c == null) || (fee.Amount__c != null && oldMapOfFeeManagement.get(fee.Id).Amount__c != null && oldMapOfFeeManagement.get(fee.Id).Amount__c != fee.Amount__c)) {
                updateAttendanceRecord(fee, currentMonthYear);
            }
        }
    }

    private static void updateAttendanceRecord(Fee_Management__c fee, String monthYear) {
        String amount = String.valueOf(fee.Amount__c);
        String dueDate = String.valueOf(fee.Due_Date__c);
        String dueAmount = String.valueOf(fee.Due_Amount__c);
        String duration = String.valueOf(fee.Duration__c);
        String feeType = String.valueOf(fee.Fee_Type__c);
        String paidAmount = String.valueOf(fee.Paid_Amount__c);
        String examinationFee = String.valueOf(fee.Examination_Fee__c);
        String tutionFee = String.valueOf(fee.Tution_Fee__c);
        String extraActivityFee = String.valueOf(fee.Extra_Activity_Fee__c);
        String admissionFee = String.valueOf(fee.Admission_Fee__c);
        String feeDate = String.valueOf(fee.Date__c);
        String paymentStatus = String.valueOf(fee.Payment_Status__c);
        
        List<Object> oldStoreTimeFieldvalue = getOldStoreFeeDetailsFieldValue(fee);
        
        
        Boolean dayFound = false;
        for (Object obj : oldStoreTimeFieldvalue) {
            Map<String, Object> monthlyData = (Map<String, Object>) obj;
            List<String> dateParts = String.valueOf(monthlyData.get('Dt')).split('-');
            String year = dateParts[0]; 
            String formattedMonth = String.valueOf(Integer.valueOf(dateParts[1]));
            String currentMonthYear = formattedMonth + ' - ' + year;
            if (currentMonthYear.equals(monthYear)) {
                monthlyData.put('FeeType', feeType);
                monthlyData.put('Amt', amount);
                monthlyData.put('DueDate', dueDate);
                monthlyData.put('PmtStatus', paymentStatus);
                monthlyData.put('PaidAmt', paidAmount);
                monthlyData.put('DueAmt', dueAmount);
                monthlyData.put('ExnFee', examinationFee);
                monthlyData.put('ExtActFee', extraActivityFee);
                monthlyData.put('AdnFee', admissionFee);
                monthlyData.put('Duration', duration);
                monthlyData.put('TutionFee', tutionFee);
                monthlyData.put('Dt', feeDate);
                dayFound = true;
                break;
            }
        }
        if (!dayFound) {
            Map<String, Object> monthlyData = new Map<String, Object>{
                'Name' => fee.Name,
                    'FeeType' => fee.Fee_Type__c,
                    'Amt' => fee.Amount__c,
                    'DueDate' => fee.Due_Date__c,
                    'PmtStatus' => fee.Payment_Status__c,
                    'StId' => fee.Student__c,
                    'StName' => fee.Student_Name__c,
                    'PaidAmt' => fee.Paid_Amount__c, 
                    'DueAmt' => fee.Due_Amount__c,
                    'ExnFee' => fee.Examination_Fee__c,
                    'ExtActFee' => fee.Extra_Activity_Fee__c,
                    'SN' => fee.S_N__c,
                    'AdnFee' => fee.Admission_Fee__c,
                    'Dt' => fee.Date__c,
                    'TutionFee' => fee.Tution_Fee__c,
                    'Duration' => fee.Duration__c
                    };
            oldStoreTimeFieldvalue.add(monthlyData);
        }
        fee.Store_Fee_Details__c = JSON.serializePretty(oldStoreTimeFieldvalue);
    }
    
    private static List<Object> getOldStoreFeeDetailsFieldValue(Fee_Management__c fee) {
        List<Object> oldStoreTimeFieldvalue = new List<Object>();
        if (fee.Store_Fee_Details__c != null) {
            oldStoreTimeFieldvalue = (List<Object>) JSON.deserializeUntyped(fee.Store_Fee_Details__c);
        }
        return oldStoreTimeFieldvalue;
    }
}