global class FeeManagementScheduler implements Schedulable { 

    global void execute(SchedulableContext sc) {
        Date dt = System.today();
        Integer year = dt.Year();
        List<Fee_Management__c> feeManagementList = [SELECT Id, Duration__c, Amount__c, Examination_Fee__c, Tution_Fee__c, Extra_Activity_Fee__c, Due_Date__c, Paid_Amount__c, Payment_Status__c, Fee_Type__c, Admission_Fee__c, Date__c FROM Fee_Management__c WHERE Name =: String.valueOf(year)];
        for(Fee_Management__c fee : feeManagementList) {
            fee.Duration__c = null;
            fee.Examination_Fee__c = null;
            fee.Tution_Fee__c = null;
            fee.Extra_Activity_Fee__c = null;
            fee.Due_Date__c = null;
            fee.Paid_Amount__c = null;
            fee.Payment_Status__c = null;
            fee.Admission_Fee__c = null;
            fee.Date__c = null;
            fee.Fee_Type__c = null;
        }
        if(!feeManagementList.isEmpty()) {
            update feeManagementList;
        }
    }
}