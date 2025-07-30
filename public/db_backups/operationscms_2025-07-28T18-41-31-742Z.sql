/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: approvals
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `approvals` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `createdBy` int(11) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(150) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `Title` varchar(150) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `unique_project_if_void1` int(11) DEFAULT NULL,
  `void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocEntry`),
  UNIQUE KEY `Title` (`Title`),
  UNIQUE KEY `unique_project_if_void1` (`unique_project_if_void1`),
  UNIQUE KEY `unique_project_void` (`unique_project_if_void1`)
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: approvals_approvers
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `approvals_approvers` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `DocEntry` int(11) DEFAULT NULL,
  `uID` int(11) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: approvals_decisions
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `approvals_decisions` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `ApprovalApproverID` int(11) DEFAULT NULL,
  `ApprovalID` int(11) DEFAULT NULL,
  `CreatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `decision` int(11) DEFAULT '0' COMMENT '0=Pending \r\n1=Approved\r\n2=Rejected',
  `DocEntry` int(11) DEFAULT NULL,
  `void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: bookings
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `bookings` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `projects_data_a_header_entry` int(11) NOT NULL,
  `Title` int(11) NOT NULL,
  `bookingDate` date NOT NULL,
  `CreatedBy` int(11) NOT NULL,
  `CreatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedDate` datetime DEFAULT NULL,
  `void` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`DocEntry`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: chart_of_accounts
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `chart_of_accounts` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `Code` varchar(150) NOT NULL,
  `Name` varchar(150) NOT NULL,
  `CreatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) NOT NULL,
  `Void` int(11) NOT NULL DEFAULT '1',
  `type` varchar(50) NOT NULL,
  PRIMARY KEY (`DocEntry`),
  UNIQUE KEY `UNIQUE_code` (`Code`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: chart_of_accountsmap
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `chart_of_accountsmap` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `Type` varchar(150) NOT NULL,
  `Dr_code` varchar(50) NOT NULL,
  `Ar_code` varchar(50) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdBy` int(11) NOT NULL,
  `void` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`DocEntry`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = latin1;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: ousr
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `ousr` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `MiddleName` varchar(255) DEFAULT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `type` int(11) DEFAULT '3',
  `user` varchar(255) DEFAULT NULL,
  `void` int(1) DEFAULT '0',
  PRIMARY KEY (`DocEntry`)
) ENGINE = InnoDB AUTO_INCREMENT = 13 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: projects
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `AddedBy` int(11) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Disc` varchar(150) DEFAULT NULL,
  `Title` varchar(150) DEFAULT NULL,
  `void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocEntry`),
  UNIQUE KEY `Title_unique` (`Title`),
  FULLTEXT KEY `Title` (`Title`)
) ENGINE = InnoDB AUTO_INCREMENT = 29 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: projects_data_a_header
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects_data_a_header` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `CreatedBy` int(11) NOT NULL,
  `ProjectID` int(11) NOT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `canceled` int(11) DEFAULT '1' COMMENT '0 = yes \r\n1 = no',
  `void` int(11) NOT NULL DEFAULT '0' COMMENT '0=pending\r\n1=Approved\r\n2=Rejected',
  PRIMARY KEY (`DocEntry`)
) ENGINE = InnoDB AUTO_INCREMENT = 8 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: projects_data_b_lines
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects_data_b_lines` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `DocEntry` int(11) NOT NULL,
  `Requirements_id` int(11) NOT NULL,
  `Requirements_value` varchar(250) NOT NULL,
  `void` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 41 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: projects_data_c_table
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects_data_c_table` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `DocEntry` int(11) NOT NULL,
  `Requirements_id` int(11) NOT NULL,
  `Requirements_value` varchar(250) NOT NULL,
  `LineID` int(11) NOT NULL,
  `void` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 43 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: projects_requirements
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects_requirements` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `DocEntry` int(11) DEFAULT NULL,
  `LineID` int(11) DEFAULT NULL,
  `createdBy` int(11) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 53 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: projects_requirements_table
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects_requirements_table` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `DocEntry` int(11) NOT NULL,
  `LineNum` int(11) NOT NULL,
  `label` varchar(255) NOT NULL,
  `type` varchar(10) NOT NULL,
  `void` int(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 15 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: selectionlist
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `selectionlist` (
  `DocEntry` int(11) NOT NULL AUTO_INCREMENT,
  `Code` varchar(150) DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `CreatedDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Name` varchar(150) DEFAULT NULL,
  `Void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocEntry`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE = InnoDB AUTO_INCREMENT = 22 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: selectionlist_fields
# ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `selectionlist_fields` (
  `DocNum` int(11) NOT NULL AUTO_INCREMENT,
  `DocEntry` int(11) DEFAULT NULL,
  `lineNum` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `void` int(11) DEFAULT '1',
  PRIMARY KEY (`DocNum`)
) ENGINE = InnoDB AUTO_INCREMENT = 105 DEFAULT CHARSET = utf8mb4;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vwdmf_approval_status
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `vwdmf_approval_status` AS
select
  `b`.`project_id` AS `project_id`,
  `a`.`DocEntry` AS `DocEntry`,(
  case
    when (count(if((`a`.`decision` = 2), 1, NULL)) > 0) then 'Rejected'
    when (
    (`b`.`type` = 2)
    and (count(if((`a`.`decision` = 1), 1, NULL)) > 0)
    ) then 'Approved'
    when (
    (`b`.`type` = 1)
    and (
      count(if((`a`.`decision` = 1), 1, NULL)) = count(`a`.`ApprovalApproverID`)
    )
    ) then 'Approved'
    else 'Pending'
  end
  ) AS `FinalApprovalStatus`
from
  (
  (
    `approvals_decisions` `a`
    left join `approvals` `b` on((`b`.`DocEntry` = `a`.`ApprovalID`))
  )
  left join `ousr` `c` on((`c`.`DocEntry` = `a`.`ApprovalApproverID`))
  )
group by
  `a`.`DocEntry`,
  `b`.`type`,
  `b`.`project_id`;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vwproject_data_entries
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `vwproject_data_entries` AS
select
  `a`.`DocEntry` AS `DocEntry`,
  `b`.`Title` AS `projectTitle`,
  `b`.`Disc` AS `Disc`,
  `c`.`Requirements_id` AS `Requirements_id`,
  `c`.`Requirements_value` AS `Requirements_value`,
  `e`.`title` AS `title`,
  `e`.`type` AS `type`,
  `f`.`name` AS `name`,
  if(
  isnull(`f`.`name`),
  `c`.`Requirements_value`,
  `f`.`name`
  ) AS `iValue`,
  `c`.`DocNum` AS `dataNumber`
from
  (
  (
    (
    (
      `projects_data_a_header` `a`
      left join `projects` `b` on((`a`.`ProjectID` = `b`.`DocEntry`))
    )
    left join `projects_data_b_lines` `c` on((`c`.`DocEntry` = `a`.`DocEntry`))
    )
    left join `projects_requirements` `e` on((`e`.`DocNum` = `c`.`Requirements_id`))
  )
  left join `selectionlist_fields` `f` on((`f`.`DocNum` = `c`.`Requirements_value`))
  )
where
  (
  (`c`.`Requirements_value` <> 'table')
  or (
    `c`.`DocNum` = (
    select
      min(`c2`.`DocNum`)
    from
      `projects_data_b_lines` `c2`
    where
      (
      (`c2`.`DocEntry` = `c`.`DocEntry`)
      and (`c2`.`Requirements_id` = `c`.`Requirements_id`)
      and (`c2`.`Requirements_value` = 'table')
      )
    )
  )
  )
order by
  `a`.`DocEntry`,
  `c`.`Requirements_id`;

# ------------------------------------------------------------
# SCHEMA DUMP FOR TABLE: vwproject_table_label
# ------------------------------------------------------------

CREATE OR REPLACE VIEW `vwproject_table_label` AS
select
  if(isnull(`b`.`Code`), `a`.`label`, `b`.`Code`) AS `label`,
  `a`.`DocEntry` AS `DocEntry`,
  `a`.`DocNum` AS `DocNum`
from
  (
  `projects_requirements_table` `a`
  left join `selectionlist` `b` on((`a`.`label` = `b`.`DocEntry`))
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: approvals
# ------------------------------------------------------------

INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    1,
    1,
    '2025-07-08 00:11:01',
    'Admin\'s Approval',
    1,
    'A1',
    2,
    NULL,
    0
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    2,
    1,
    '2025-07-08 10:59:26',
    'test',
    1,
    'user creation',
    2,
    NULL,
    1
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    3,
    1,
    '2025-07-10 00:00:43',
    'Admin All Approval',
    13,
    'Admins',
    0,
    NULL,
    1
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    4,
    1,
    '2025-07-13 16:38:25',
    'GI approval',
    24,
    'GI approval',
    2,
    NULL,
    1
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    5,
    1,
    '2025-07-17 13:58:44',
    'test',
    27,
    'test approval',
    2,
    NULL,
    1
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    6,
    1,
    '2025-07-24 14:02:58',
    ' ',
    25,
    'Medical Approval',
    2,
    NULL,
    1
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (7, 1, '2025-07-24 20:13:54', '', 26, '', 0, NULL, 0);
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (8, 1, '2025-07-24 20:19:52', 'qw', 26, 'asd', 2, NULL, 1);
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    10,
    1,
    '2025-07-24 21:21:50',
    'asd',
    26,
    'asdasd',
    1,
    NULL,
    0
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    13,
    1,
    '2025-07-24 22:28:21',
    'asd',
    25,
    'asdasdasd',
    0,
    NULL,
    0
  );
INSERT INTO
  `approvals` (
    `DocEntry`,
    `createdBy`,
    `createdDate`,
    `description`,
    `project_id`,
    `Title`,
    `type`,
    `unique_project_if_void1`,
    `void`
  )
VALUES
  (
    14,
    1,
    '2025-07-24 22:36:34',
    'asd',
    25,
    'test',
    0,
    NULL,
    0
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: approvals_approvers
# ------------------------------------------------------------

INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (1, 1, 1, '2025-07-08 00:11:01', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (2, 2, 3, '2025-07-08 10:59:26', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (3, 2, 4, '2025-07-08 10:59:26', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (4, 2, 1, '2025-07-08 10:59:27', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (5, 3, 1, '2025-07-10 00:00:43', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (6, 3, 3, '2025-07-10 00:00:43', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (7, 4, 3, '2025-07-13 16:38:25', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (8, 4, 4, '2025-07-13 16:38:25', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (9, 5, 1, '2025-07-17 13:58:45', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (10, 5, 3, '2025-07-17 13:58:45', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (11, 5, 4, '2025-07-17 13:58:45', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (12, 6, 1, '2025-07-24 14:02:58', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (13, 8, 1, '2025-07-24 20:19:52', 1);
INSERT INTO
  `approvals_approvers` (`DocNum`, `DocEntry`, `uID`, `createdDate`, `void`)
VALUES
  (14, 10, 1, '2025-07-24 21:21:51', 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: approvals_decisions
# ------------------------------------------------------------

INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (1, 3, 4, '2025-07-17 17:08:02', 0, 1, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (2, 4, 4, '2025-07-17 17:08:02', 0, 1, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (3, 1, 4, '2025-07-19 01:01:16', 1, 2, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (4, 4, 4, '2025-07-19 01:01:16', 0, 2, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (5, 1, 6, '2025-07-24 14:15:53', 2, 4, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (6, 1, 6, '2025-07-24 14:18:12', 1, 5, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (7, 1, 6, '2025-07-24 14:49:42', 1, 6, 1);
INSERT INTO
  `approvals_decisions` (
    `DocNum`,
    `ApprovalApproverID`,
    `ApprovalID`,
    `CreatedDate`,
    `decision`,
    `DocEntry`,
    `void`
  )
VALUES
  (8, 1, 8, '2025-07-24 20:20:34', 1, 7, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: bookings
# ------------------------------------------------------------

INSERT INTO
  `bookings` (
    `DocEntry`,
    `projects_data_a_header_entry`,
    `Title`,
    `bookingDate`,
    `CreatedBy`,
    `CreatedDate`,
    `UpdatedDate`,
    `void`
  )
VALUES
  (
    1,
    1,
    1,
    '0000-00-00',
    1,
    '2025-07-28 19:51:27',
    NULL,
    1
  );
INSERT INTO
  `bookings` (
    `DocEntry`,
    `projects_data_a_header_entry`,
    `Title`,
    `bookingDate`,
    `CreatedBy`,
    `CreatedDate`,
    `UpdatedDate`,
    `void`
  )
VALUES
  (
    2,
    1,
    1,
    '2025-07-24',
    1,
    '2025-07-28 19:58:22',
    NULL,
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: chart_of_accounts
# ------------------------------------------------------------

INSERT INTO
  `chart_of_accounts` (
    `DocEntry`,
    `Code`,
    `Name`,
    `CreatedDate`,
    `createdBy`,
    `Void`,
    `type`
  )
VALUES
  (
    1,
    '30000028',
    'Medical ',
    '2025-07-25 00:03:24',
    1,
    1,
    'Project'
  );
INSERT INTO
  `chart_of_accounts` (
    `DocEntry`,
    `Code`,
    `Name`,
    `CreatedDate`,
    `createdBy`,
    `Void`,
    `type`
  )
VALUES
  (
    6,
    '10000100',
    'Cash In Bank',
    '2025-07-25 15:56:34',
    1,
    1,
    'Assets'
  );
INSERT INTO
  `chart_of_accounts` (
    `DocEntry`,
    `Code`,
    `Name`,
    `CreatedDate`,
    `createdBy`,
    `Void`,
    `type`
  )
VALUES
  (
    7,
    '20000100',
    'Miscellaneous Expense',
    '2025-07-25 16:05:52',
    1,
    1,
    'Expenses'
  );
INSERT INTO
  `chart_of_accounts` (
    `DocEntry`,
    `Code`,
    `Name`,
    `CreatedDate`,
    `createdBy`,
    `Void`,
    `type`
  )
VALUES
  (
    8,
    '40000100',
    'Project Payables',
    '2025-07-25 17:38:49',
    1,
    1,
    'Payable'
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: chart_of_accountsmap
# ------------------------------------------------------------

INSERT INTO
  `chart_of_accountsmap` (
    `DocEntry`,
    `Type`,
    `Dr_code`,
    `Ar_code`,
    `createdDate`,
    `createdBy`,
    `void`
  )
VALUES
  (1, 'AR', '1', '1', '2025-07-25 21:47:45', 1, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: ousr
# ------------------------------------------------------------

INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    1,
    'd@g.c',
    'Dean',
    'Mark',
    'D',
    'test',
    1,
    'dmark34907',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    3,
    'famolerasd@gmail.com',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    1,
    '1',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    4,
    '1@g.com',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    1,
    '1',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    5,
    '1@1.com',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    6,
    '1@1.com2',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    7,
    '1@1.com23',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    0
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    8,
    '1@1.com234',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    9,
    '1@1.com2345',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    1
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    10,
    '1@1.com23456',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    0
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    11,
    '1@1.com234567',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '1',
    3,
    '1',
    0
  );
INSERT INTO
  `ousr` (
    `DocEntry`,
    `email`,
    `FirstName`,
    `LastName`,
    `MiddleName`,
    `pass`,
    `type`,
    `user`,
    `void`
  )
VALUES
  (
    12,
    '1@1.com2333',
    'Deanmark',
    'Famoleras',
    'Batucan',
    '2',
    3,
    '2',
    0
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: projects
# ------------------------------------------------------------

INSERT INTO
  `projects` (
    `DocEntry`,
    `AddedBy`,
    `createdDate`,
    `Disc`,
    `Title`,
    `void`
  )
VALUES
  (
    1,
    1,
    '2025-07-08 00:10:07',
    'A required form for new users, ensuring all fields are completed before submission. Entries are routed for approval prior to account activation.',
    'User Registration Form',
    1
  );
INSERT INTO
  `projects` (
    `DocEntry`,
    `AddedBy`,
    `createdDate`,
    `Disc`,
    `Title`,
    `void`
  )
VALUES
  (
    24,
    1,
    '2025-07-10 22:58:13',
    ' ',
    ' General Intake Sheet',
    1
  );
INSERT INTO
  `projects` (
    `DocEntry`,
    `AddedBy`,
    `createdDate`,
    `Disc`,
    `Title`,
    `void`
  )
VALUES
  (28, 1, '2025-07-25 00:03:23', 'asd', 'Form1', 0);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: projects_data_a_header
# ------------------------------------------------------------

INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (1, 1, 24, '2025-07-17 17:07:58', 1, 0);
INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (2, 1, 24, '2025-07-19 01:01:12', 1, 0);
INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (3, 1, 25, '2025-07-24 13:58:53', 1, 0);
INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (4, 1, 25, '2025-07-24 14:15:52', 1, 0);
INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (5, 1, 25, '2025-07-24 14:18:11', 1, 0);
INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (6, 1, 25, '2025-07-24 14:49:41', 1, 0);
INSERT INTO
  `projects_data_a_header` (
    `DocEntry`,
    `CreatedBy`,
    `ProjectID`,
    `createdDate`,
    `canceled`,
    `void`
  )
VALUES
  (7, 1, 26, '2025-07-24 20:20:33', 1, 0);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: projects_data_b_lines
# ------------------------------------------------------------

INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (1, 1, 32, '2025-07-17', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (2, 1, 33, '65', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (3, 1, 34, 'Present Address', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (4, 1, 35, 'Brith Place', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (5, 1, 36, '28', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (6, 1, 37, '67', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (7, 1, 38, '74', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (8, 1, 39, '75', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (9, 1, 40, 'Skills', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (10, 1, 41, '92', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (11, 1, 42, '15000', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (12, 1, 43, 'table', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (13, 2, 32, '2025-07-19', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (14, 2, 33, '65', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (15, 2, 34, 'address', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (16, 2, 35, 'place', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (17, 2, 36, '28', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (18, 2, 37, '67', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (19, 2, 38, '74', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (20, 2, 39, '75', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (21, 2, 40, 'skills', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (22, 2, 41, '92', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (23, 2, 42, '31000', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (24, 2, 43, 'table', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (25, 2, 43, 'table', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (26, 3, 44, 'test', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    27,
    3,
    47,
    '/uploads/1753336720310-133906532066114429.jpg',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    28,
    3,
    48,
    '/uploads/1753336731761-Screenshot 2025-07-21 202045.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (29, 4, 44, 'test', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    30,
    4,
    47,
    '/uploads/1753337741629-Screenshot 2025-07-20 185208.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    31,
    4,
    48,
    '/uploads/1753337749019-Screenshot 2025-07-18 141305.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (32, 5, 44, 'test', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    33,
    5,
    47,
    '/uploads/1753337741629-Screenshot 2025-07-20 185208.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    34,
    5,
    48,
    '/uploads/1753337749019-Screenshot 2025-07-18 141305.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (35, 6, 44, 'asd', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    36,
    6,
    47,
    '/uploads/1753339769330-Screenshot 2025-06-21 224146.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    37,
    6,
    48,
    '/uploads/1753339776705-Screenshot 2025-07-03 204401.png',
    1
  );
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (38, 7, 45, '3', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (39, 7, 49, '2025-07-01', 1);
INSERT INTO
  `projects_data_b_lines` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `void`
  )
VALUES
  (
    40,
    7,
    50,
    '/uploads/1753359624929-Screenshot 2025-07-05 132541.png',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: projects_data_c_table
# ------------------------------------------------------------

INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (1, 12, 6, 'last name', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (2, 12, 7, 'frist name', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (3, 12, 8, 'middle name', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (4, 12, 9, '65', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (5, 12, 10, '74', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (6, 12, 11, '28', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (7, 12, 12, '75', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (8, 12, 13, 'occupation', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (9, 12, 14, '123', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (10, 12, 6, 'last name', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (11, 12, 7, 'frist name', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (12, 12, 8, 'middle name', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (13, 12, 9, '65', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (14, 12, 10, '74', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (15, 12, 11, '28', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (16, 12, 12, '75', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (17, 12, 13, 'occupation', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (18, 12, 14, '123', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (25, 24, 6, 'last name 1', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (26, 24, 7, 'first name 1 ', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (27, 24, 8, 'middlename 2', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (28, 24, 9, '65', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (29, 24, 10, '74', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (30, 24, 11, '28', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (31, 24, 12, '75', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (32, 24, 13, 'skil1', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (33, 24, 14, '123123', 1, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (34, 25, 6, 'last name 2', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (35, 25, 7, 'fisrt name 2', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (36, 25, 8, 'middlenam2 2', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (37, 25, 9, '66', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (38, 25, 10, '74', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (39, 25, 11, '29', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (40, 25, 12, '77', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (41, 25, 13, 'skill3', 2, 1);
INSERT INTO
  `projects_data_c_table` (
    `DocNum`,
    `DocEntry`,
    `Requirements_id`,
    `Requirements_value`,
    `LineID`,
    `void`
  )
VALUES
  (42, 25, 14, '123265', 2, 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: projects_requirements
# ------------------------------------------------------------

INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    1,
    1,
    1,
    1,
    '2025-07-08 00:10:08',
    'First Name',
    'Text',
    'text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    2,
    1,
    2,
    1,
    '2025-07-08 00:10:08',
    'Middle Name',
    'Text',
    'text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    3,
    1,
    3,
    1,
    '2025-07-08 00:10:08',
    'Last Name',
    'Text',
    'text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    4,
    1,
    4,
    1,
    '2025-07-08 00:10:08',
    'Username',
    'Text',
    'text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    5,
    1,
    5,
    1,
    '2025-07-08 00:10:08',
    'Email',
    'Email',
    'text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    28,
    21,
    1,
    1,
    '2025-07-10 01:14:53',
    'fileUpload',
    'file',
    '.pdf',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    29,
    21,
    2,
    1,
    '2025-07-10 01:14:53',
    'SelectionList',
    'selection',
    '1',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    30,
    22,
    6,
    1,
    '2025-07-10 18:59:27',
    'test',
    'file',
    '.pdf',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    31,
    23,
    2,
    1,
    '2025-07-10 19:53:05',
    'test of first table',
    'table',
    '',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    32,
    24,
    1,
    1,
    '2025-07-10 22:58:13',
    'Birth Date',
    'text',
    'Date',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    33,
    24,
    3,
    1,
    '2025-07-10 22:58:14',
    'Gender',
    'selection',
    '17',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    34,
    24,
    4,
    1,
    '2025-07-10 22:58:14',
    'Present Address',
    'text',
    'Text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    35,
    24,
    5,
    1,
    '2025-07-10 22:58:14',
    'Birth Place',
    'text',
    'Text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    36,
    24,
    7,
    1,
    '2025-07-10 22:58:14',
    'Relationship to Beneficiary',
    'selection',
    '16',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    37,
    24,
    8,
    1,
    '2025-07-10 22:58:15',
    'Civil Status',
    'selection',
    '18',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    38,
    24,
    10,
    1,
    '2025-07-10 22:58:15',
    'Nationality',
    'selection',
    '19',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    39,
    24,
    11,
    1,
    '2025-07-10 22:58:15',
    'Highest Educational Attainment ',
    'selection',
    '20',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    40,
    24,
    12,
    1,
    '2025-07-10 22:58:16',
    'Skills/Occupation',
    'text',
    'Text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    41,
    24,
    14,
    1,
    '2025-07-10 22:58:16',
    'Religion',
    'selection',
    '21',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    42,
    24,
    15,
    1,
    '2025-07-10 22:58:16',
    'Estimated Monthly Income',
    'text',
    'Number',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    43,
    24,
    16,
    1,
    '2025-07-10 22:58:17',
    'Beneficiary’s Family Composition',
    'table',
    '',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    44,
    25,
    1,
    1,
    '2025-07-10 23:02:14',
    'asd',
    'text',
    'Email',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    45,
    26,
    1,
    1,
    '2025-07-11 00:57:13',
    'test',
    'text',
    'Number',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    46,
    27,
    1,
    1,
    '2025-07-17 13:44:01',
    'testa',
    'text',
    'Text',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    47,
    25,
    2,
    1,
    '2025-07-23 14:06:40',
    'Birth Certificate',
    'file',
    '.pdf',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    48,
    25,
    3,
    1,
    '2025-07-23 14:06:40',
    'Prescriptions',
    'file',
    '.pdf',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    49,
    26,
    1,
    1,
    '2025-07-24 20:11:04',
    'birth date',
    'text',
    'Date',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    50,
    26,
    2,
    1,
    '2025-07-24 20:11:04',
    'test',
    'file',
    '.pdf',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    51,
    27,
    2,
    1,
    '2025-07-24 23:44:57',
    'Birth Cert',
    'file',
    '.pdf',
    1
  );
INSERT INTO
  `projects_requirements` (
    `DocNum`,
    `DocEntry`,
    `LineID`,
    `createdBy`,
    `createdDate`,
    `title`,
    `type`,
    `value`,
    `void`
  )
VALUES
  (
    52,
    28,
    2,
    1,
    '2025-07-25 00:03:24',
    'asd',
    'file',
    '.pdf',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: projects_requirements_table
# ------------------------------------------------------------

INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (6, 43, 1, 'Last Name', 'text', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (7, 43, 2, 'First Name', 'text', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (8, 43, 3, 'Middle Name', 'text', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (9, 43, 4, '17', 'dropdown', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (10, 43, 5, '19', 'dropdown', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (11, 43, 6, '16', 'dropdown', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (12, 43, 7, '20', 'dropdown', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (13, 43, 8, 'Skills/Occupation', 'text', 1);
INSERT INTO
  `projects_requirements_table` (
    `DocNum`,
    `DocEntry`,
    `LineNum`,
    `label`,
    `type`,
    `void`
  )
VALUES
  (14, 43, 9, 'Est. Monthly Income', 'number', 1);

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: selectionlist
# ------------------------------------------------------------

INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    1,
    'Barangay',
    1,
    '2025-07-08 10:43:05',
    'List of Barangays',
    1
  );
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    15,
    'Months',
    1,
    '2025-07-09 22:52:41',
    'List of months',
    1
  );
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    16,
    'Relationships',
    1,
    '2025-07-10 20:26:53',
    'Relationships',
    1
  );
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (17, 'Gender', 1, '2025-07-10 20:47:30', 'Gender', 1);
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    18,
    'Civil Status',
    1,
    '2025-07-10 20:49:33',
    'Civil Status',
    1
  );
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    19,
    'Nationality',
    1,
    '2025-07-10 20:50:25',
    'Nationality',
    1
  );
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    20,
    'Highest Educational Attainment',
    1,
    '2025-07-10 20:51:37',
    'Highest Educational Attainment',
    1
  );
INSERT INTO
  `selectionlist` (
    `DocEntry`,
    `Code`,
    `CreatedBy`,
    `CreatedDate`,
    `Name`,
    `Void`
  )
VALUES
  (
    21,
    'Religion',
    1,
    '2025-07-10 21:01:17',
    'Religion',
    1
  );

# ------------------------------------------------------------
# DATA DUMP FOR TABLE: selectionlist_fields
# ------------------------------------------------------------

INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (1, 1, 1, 'Sulana', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (2, 1, 4, 'wa me balo', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (3, 1, 3, 'asa mani?', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (4, 1, 2, 'villanueva', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (14, 15, 1, 'Jan', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (15, 15, 6, 'Jun', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (16, 15, 5, 'May', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (17, 15, 4, 'Apr', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (18, 15, 2, 'Feb', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (19, 15, 3, 'Mar', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (20, 15, 7, 'Jul', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (21, 15, 9, 'Sep', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (22, 15, 10, 'Oct', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (23, 15, 12, 'Dec', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (24, 15, 8, 'Aug', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (25, 15, 11, 'Nov', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (28, 16, 1, 'Spouse', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (29, 16, 2, 'Son', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (30, 16, 3, 'Daughter', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (31, 16, 4, 'Father', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (32, 16, 5, 'Mother', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (33, 16, 6, 'Brother', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (34, 16, 7, 'Sister', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (35, 16, 8, 'Grandfather', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (36, 16, 9, 'Grandmother', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (37, 16, 10, 'Grandson', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (38, 16, 11, 'Granddaughter', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (39, 16, 12, 'Uncle', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (40, 16, 13, 'Aunt', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (41, 16, 14, 'Nephew', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (42, 16, 15, 'Niece', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (43, 16, 16, 'Cousin', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (44, 16, 17, 'Stepfather', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (45, 16, 18, 'Stepmother', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (46, 16, 19, 'Stepson', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (47, 16, 20, 'Stepdaughter', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (48, 16, 21, 'Half-brother', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (49, 16, 22, 'Half-sister', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (50, 16, 23, 'Father-in-law', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (51, 16, 24, 'Mother-in-law', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (52, 16, 25, 'Partner', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (53, 16, 26, 'Domestic Partner', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (54, 16, 27, 'Fiancé', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (55, 16, 28, 'Fiancée', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (56, 16, 29, 'Guardian', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (57, 16, 30, 'Ward', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (58, 16, 31, 'Adopted Child', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (59, 16, 32, 'Foster Child', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (60, 16, 33, 'Legal Dependent', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (61, 16, 34, 'Friend', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (62, 16, 35, 'Employer', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (63, 16, 36, 'Employee', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (64, 16, 37, 'Organization', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (65, 17, 2, 'Female', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (66, 17, 1, 'Male', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (67, 18, 1, 'Single', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (68, 18, 4, 'Divorced', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (69, 18, 3, 'Widowed', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (70, 18, 6, 'Annulled', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (71, 18, 5, 'Separated', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (72, 18, 2, 'Married', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (73, 18, 7, 'Engaged', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (74, 19, 1, 'Filipino', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (75, 20, 1, 'No Formal Education', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (76, 20, 1, 'No Formal Education', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (77, 20, 2, 'Elementary Level', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (78, 20, 3, 'Elementary Graduate', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (79, 20, 4, 'High School Level', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (80, 20, 5, 'High School Graduate', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (81, 20, 6, 'Vocational / Technical Course', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (82, 20, 7, 'College Level', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (83, 20, 8, 'College Graduate', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (84, 20, 9, 'Bachelor\'s Degree', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (85, 20, 10, 'Master\'s Degree', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (86, 20, 11, 'Doctorate Degree', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (87, 20, 12, 'Post-Doctorate', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (88, 20, 13, 'ALS Graduate', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (89, 20, 14, 'Undergrad (with units)', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (92, 21, 1, 'Roman Catholic', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (93, 21, 2, 'Iglesia ni Cristo', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (94, 21, 3, 'Evangelical', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (95, 21, 4, 'Protestant', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (96, 21, 5, 'Baptist', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (97, 21, 6, 'Seventh-day Adventist', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (98, 21, 7, 'Jehovah’s Witnesses', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (99, 21, 8, 'Islam', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (100, 21, 9, 'Born Again Christian', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (101, 21, 10, 'Christian (Non-Denominational)', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (102, 21, 12, 'Methodist', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (103, 21, 13, 'Pentecostal', 1);
INSERT INTO
  `selectionlist_fields` (`DocNum`, `DocEntry`, `lineNum`, `name`, `void`)
VALUES
  (104, 21, 14, 'None', 1);

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
