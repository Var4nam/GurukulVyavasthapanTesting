public with sharing class DataFactory {
    
    public static Event_Management__c createEventManagementRecord(String name, Boolean isInsert) {
        Event_Management__c evt = new Event_Management__c();
        evt.Name = name;
        evt.Date__c = System.today();
        if(isInsert) {
            try {
                if(Schema.sObjectType.Event_Management__c.isCreateable()) {
                    insert evt;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting Event Management record: ' + e.getMessage());
            }
        }
        return evt;
    }
    
    public static Holiday__c createHolidayRecord(HolidayRecordParameters params) {
        Holiday__c holiday = new Holiday__c(
            Name = params.name,
            Date__c = Date.newInstance(Integer.valueOf(params.year), Integer.valueOf(params.day), Date.today().month()),
            Day__c = params.day,
            Year__c = params.year,
            Type__c = params.holidayType,
            Event_Management__c = params.eventId
        );
        
        if (params.isInsert) {
            try {
                if (Schema.sObjectType.Holiday__c.isCreateable()) {
                    insert holiday;
                } else {
                    System.debug('Cannot insert Holiday record: Object is not createable');
                }
            } catch (DmlException e) {
                System.debug('An error occurred while inserting Holiday record: ' + e.getMessage());
            }
        }
        
        return holiday; 
    }
    
    public static Account createAccountRecord(Boolean isInsert) {
        Account SchoolObj = new Account(Name = 'Test School', No_Of_Period__c = 1, Start_Time__c = Time.newInstance(0, 2, 2, 0), Duration__c = 1);
        if(isInsert) {
            try {
                if(Schema.sObjectType.Account.isCreateable()) {
                    INSERT SchoolObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting Account record: ' + e.getMessage());
            }
        }
        return SchoolObj;
    }
    
    public static Class__c createClassRecord(Id SchoolObj, Boolean isInsert) {
        Class__c classObj = new Class__c(Name = 'Test Class', School__c = SchoolObj, Section__c = 'A1');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Class__c.isCreateable()) {
                    INSERT classObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting Class record: ' + e.getMessage());
            }
        }
        return classObj;
    }
    
    public static Fee_Management__c createFeeManagementRecord(Id testStudent, Boolean isInsert) {
        Fee_Management__c testFee = new Fee_Management__c(Name = 'Test Fee', Due_Date__c = Date.today(), Student__c = testStudent,
                                                          Duration__c = '1 Months', Fee_Type__c = 'Tuition', Paid_Amount__c = 50, Payment_Status__c = 'Paid');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Fee_Management__c.isCreateable()) {
                    INSERT testFee;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting subject record: ' + e.getMessage());
            }
        }
        return testFee;
    }
    
    public static Class__c createClassDuplicateRecords(Id SchoolObj, Boolean isInsert) {
        Class__c classObj = new Class__c(Name = 'Test Class', School__c = SchoolObj, Section__c = 'A1');
        Class__c classObjSecond = new Class__c(Name = 'Test Class', School__c = SchoolObj, Section__c = 'A1');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Class__c.isCreateable()) {
                    INSERT classObj;
                    INSERT classObjSecond;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting subject record: ' + e.getMessage());
            }
        }
        return classObjSecond;
    }
    
    public static TimeTable__c createTimeTableRecord(Id classObj, Id teacherObj, Boolean isInsert) {
        TimeTable__c timeTableObj = new TimeTable__c(Teacher__c = teacherObj, Day__c = 'Monday', Period__c = 1, Class__c = classObj);
        if(isInsert) {
            try {
                if(Schema.sObjectType.TimeTable__c.isCreateable()) {
                    INSERT timeTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting TimeTable record: ' + e.getMessage());
            }
        }
        return timeTableObj;
    }
    
    public static Teacher__c createTeacherRecord(Id schoolId, Boolean isInsert) {
        Teacher__c teacherTableObj = new Teacher__c(First_Name__c = 'Test', School__c = schoolId, Gender__c = 'Male', Profile__c = 'Teacher');
        if (isInsert) {
            try {
                if(Schema.sObjectType.Teacher__c.isCreateable()) {
                    insert teacherTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting teacher record: ' + e.getMessage());
            }
        }
        return teacherTableObj;
    }
    
    public static Staff__c createStaffRecord(Boolean isInsert) {
        Staff__c staffRecord = new Staff__c(Name = 'Test Staff', Staff_Type__c = 'Driver', Gender__c = 'Male', Profile__c = 'Staff');
        if (isInsert) {
            try {
                if(Schema.sObjectType.Staff__c.isCreateable()) {
                    insert staffRecord;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting teacher record: ' + e.getMessage());
            }
        }
        return staffRecord;
    }
    
    public static Subject__c createSubjectRecord(Boolean isInsert) {
        Subject__c subjectTableObj = new Subject__c(Name = 'Test');
        if (isInsert) {
            try {
                if(Schema.sObjectType.Subject__c.isCreateable()) {
                    insert subjectTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting subject record: ' + e.getMessage());
            }
        }
        return subjectTableObj;
    }
    
    public static Subject__c createSubjectWithClass(Boolean isInsert) {
        Subject__c subjectTableObj = new Subject__c(Name = 'Test - 1', Subject_Code__c = 'sub-102');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Subject__c.isCreateable()) {
                    INSERT subjectTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting subject record: ' + e.getMessage());
            }
        }
        return subjectTableObj;
    }
    
    public static Subject__c createSubjectDuplicateRecords(Boolean isInsert) {
        Subject__c subjectFirst = new Subject__c(Name = 'Test - 1', Subject_Code__c = 'sub-102');
        Subject__c subjectSecond = new Subject__c(Name = 'Test - 1', Subject_Code__c = 'sub-102');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Subject__c.isCreateable()) {
                    INSERT subjectFirst;
                    INSERT subjectSecond;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting subject record: ' + e.getMessage());
            }
        }
        return subjectSecond;
    }
    
    public static Assign_Classes__c createAssignClassRecord(Id classObjId, Id subjectObjId, Id teacherObjId, Boolean isInsert) {
        Assign_Classes__c assignClassTableObj = new Assign_Classes__c(class__c = classObjId, subject__c = subjectObjId, teacher__c = teacherObjId);
        if(isInsert) {
            try {
                if(Schema.sObjectType.Assign_Classes__c.isCreateable()) {
                    INSERT assignClassTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting assignClass record: ' + e.getMessage());
            }
        }
        return assignClassTableObj;
    }
    
    public static Assign_Classes__c createAssignClassDuplicateRecords(Id classObjId, Id subjectObjId, Id teacherObjId, Boolean isInsert) {
        Assign_Classes__c assignClassTableObj = new Assign_Classes__c(class__c = classObjId, subject__c = subjectObjId, teacher__c = teacherObjId);
        Assign_Classes__c assignClassDuplicateTableObj = new Assign_Classes__c(class__c = classObjId, subject__c = subjectObjId, teacher__c = teacherObjId);
        if(isInsert) {
            try {
                if(Schema.sObjectType.Assign_Classes__c.isCreateable()) {
                    INSERT assignClassTableObj;
                    INSERT assignClassDuplicateTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting subject record: ' + e.getMessage());
            }
        }
        return assignClassDuplicateTableObj;
    }
    
    public static Result__c createResultRecord(Boolean isInsert) {
        Result__c resultTableObj = new Result__c(Name = 'Test Result');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Result__c.isCreateable()) {
                    INSERT resultTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting result record: ' + e.getMessage());
            }
        }
        return resultTableObj;
    }
    
    public static Student__c createStudentRecord(String stuName, Id classObj, Id schoolId, Boolean isInsert) {
        Student__c studentTableObj = new Student__c(Name = stuName, First_Name__c = stuName, class__c = classObj, School__c = schoolId, roll_number__c = 7412589, Gender__c = 'Male', Profile__c = 'Student');
        if(isInsert) {
            try {
                if(Schema.sObjectType.Student__c.isCreateable()) {
                    INSERT studentTableObj;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting student record: ' + e.getMessage());
            }
        }
        return studentTableObj;
    }
    
    public static Leave__c createLeaveRecord(Id techRecord, Id staffRecord, Boolean isInsert) {
        Leave__c testLeave = new Leave__c(
            Name = 'Test Leave',
            Status__c = 'Pending',
            To__c = techRecord,
            From_Date__c = System.today(),
            Sessions__c = 'Before Lunch Break',
            To_Date__c = System.today()+2,
            //Staff__c = staffRecord,
            Multi_Select_Teacher__c = techRecord
        );
        if(isInsert) {
            try {
                if(Schema.sObjectType.Leave__c.isCreateable()) {
                    INSERT testLeave;
                }
            } catch (Exception e) {
                System.debug('An error occurred while inserting Leave record: ' + e.getMessage());
            }
        }
        return testLeave;
    }
    
    
    
    
    public class HolidayRecordParameters {
        public String name;
        public String holidayType;
        public String day;
        public String year;
        public Boolean isInsert;
        public String eventId;
        
        public HolidayRecordParameters(String name, String holidayType, String day, String year, Boolean isInsert, String eventId) {
            this.name = name;
            this.holidayType = holidayType;
            this.day = day;
            this.year = year;
            this.isInsert = isInsert;
            this.eventId = eventId;
        }
    }
}