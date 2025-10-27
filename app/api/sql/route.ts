import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

const queryMap: Record<
  string,
  {
    sql: string;
    count: number;
    transformType?: "groupBy";
    groupBy?: string;
    childKey?: string;
    childFields?: string[];
  }
> = {


  getCountPerService: {
    sql: `
          SELECT  
          count(A.DocEntry) Total
          ,A.Title

          FROM projects A
          LEFT JOIN projects_data_a_header B on B.ProjectID = A.DocEntry
          where A.void = 1 and A.DocEntry NOT in (1,24)
      group by A.Title
      AND DATE(B.createdDate) >= ?
      AND DATE(B.createdDate) <= ?
  `,
    count: 2,
  },


  getTree: {
    sql: `
         SELECT  
    A.DocEntry,  
    B.Title,  
    B.Disc,  
    C.FinalApprovalStatus,  
    E.bookingDate,  
    F.DocEntry AS EvaluationId,  
    G.acquired_fund,  
    G.confirm_recieveBy,
        A.CreatedBy , 
    X.FirstName,
    X.LastName,
    X.MiddleName,
    CASE
        WHEN C.FinalApprovalStatus IS NULL THEN 'No approval status'
        WHEN C.FinalApprovalStatus != 'Approved' THEN C.FinalApprovalStatus
        WHEN E.bookingDate IS NULL THEN 'For booking'
        WHEN F.DocEntry IS NULL THEN 'For evaluation'
        WHEN (G.acquired_fund IS NULL OR G.acquired_fund = 0) THEN 'Fund requested to Treasury'
        WHEN (G.confirm_recieveBy IS NULL OR G.confirm_recieveBy = 0) THEN 'Fund for entry'
        ELSE 'Completed'
    END AS Status
FROM projects_data_a_header A
LEFT JOIN projects B 
    ON A.ProjectID = B.DocEntry
LEFT JOIN vwdmf_approval_status C 
    ON C.project_id = A.ProjectID 
    AND C.DocEntry = A.DocEntry
LEFT JOIN bookings E 
    ON E.projects_data_a_header_entry = A.DocEntry 
    AND E.void = 1
LEFT JOIN evaluation F 
    ON F.bookingid = E.DocEntry 
    AND F.void = 1 
LEFT JOIN fund_entry G 
    ON G.project_header_id = A.DocEntry 
    AND G.void = 1
left join ousr X on X.DocEntry = A.CreatedBy
where B.DocEntry not in (1,24)  
      AND DATE(A.createdDate) >= ?
      AND DATE(A.createdDate) <= ?
ORDER BY A.DocEntry ASC
  `,
    count: 2,
  },

  

  getTreePerID: {
    sql: `
         SELECT  
    A.DocEntry,  
    B.Title,  
    B.Disc,  
    C.FinalApprovalStatus,  
    E.bookingDate,  
    F.DocEntry AS EvaluationId,  
    G.acquired_fund,  
    G.confirm_recieveBy,
        A.CreatedBy , 
    X.FirstName,
    X.LastName,
    X.MiddleName,
    CASE
        WHEN C.FinalApprovalStatus IS NULL THEN 'No approval status'
        WHEN C.FinalApprovalStatus != 'Approved' THEN C.FinalApprovalStatus
        WHEN E.bookingDate IS NULL THEN 'For booking'
        WHEN F.DocEntry IS NULL THEN 'For evaluation'
        WHEN (G.acquired_fund IS NULL OR G.acquired_fund = 0) THEN 'Fund requested to Treasury'
        WHEN (G.confirm_recieveBy IS NULL OR G.confirm_recieveBy = 0) THEN 'Fund for entry'
        ELSE 'Completed'
    END AS Status
FROM projects_data_a_header A
LEFT JOIN projects B 
    ON A.ProjectID = B.DocEntry
LEFT JOIN vwdmf_approval_status C 
    ON C.project_id = A.ProjectID 
    AND C.DocEntry = A.DocEntry
LEFT JOIN bookings E 
    ON E.projects_data_a_header_entry = A.DocEntry 
    AND E.void = 1
LEFT JOIN evaluation F 
    ON F.bookingid = E.DocEntry 
    AND F.void = 1 
LEFT JOIN fund_entry G 
    ON G.project_header_id = A.DocEntry 
    AND G.void = 1
left join ousr X on X.DocEntry = A.CreatedBy
where B.DocEntry not in (1,24)  
and A.CreatedBy = ?
ORDER BY A.DocEntry ASC
  `,
    count: 1,
  },

  
  getFundSummary: {
    sql: `
    SELECT 
      SUM(CASE WHEN A.confirm_recieveBy > 0 THEN acquired_fund ELSE 0 END) AS receivedFunds,
      SUM(CASE WHEN A.confirm_recieveBy = 0 THEN acquired_fund ELSE 0 END) AS unreceivedFund,
      CASE 
        WHEN ? <> '' THEN getBarangayPerUser(B.CreatedBy)
        ELSE 'All Barangays'
      END AS barangay
    FROM fund_entry A
    LEFT JOIN projects_data_a_header B 
      ON A.project_header_id = B.DocEntry
    WHERE 
      (? = '' OR getBarangayPerUser(B.CreatedBy) = ?)
      AND DATE(A.created_date) >= ?
      AND DATE(A.created_date) <= ?
    GROUP BY 
      CASE WHEN ? = '' THEN NULL ELSE getBarangayPerUser(B.CreatedBy) END
  `,
    count: 6,
  },

  getApprovalForDashBoard: {
    sql: `
  SELECT
    SUM(CASE WHEN decision = 0 THEN 1 ELSE 0 END) AS Pending,
    SUM(decision) AS overAll
  FROM approvals_decisions A
  where 
     DATE(A.CreatedDate) >= ?
      AND DATE(A.CreatedDate) <= ?
  ; 
  `,
    count: 2,
  },





  updateFund: {
    sql: `UPDATE fund_entry SET confirm_recieveBy = ? , recievedDate = CURRENT_TIMESTAMP WHERE DocEntry = ?`,
    count: 2,
  },
  getFundEntryPerID: {
    sql: ` SELECT * FROM fund_entry where DocEntry = ?`,
    count: 1,
  },
  insertFE: {
    sql: `
    INSERT INTO fund_entry 
    ( created_by, project_header_id, requested_fund, acquired_fund)
    VALUES ( ?, ?, ?, ?);`,
    count: 4,
  },
  getNotifById: {
    sql: `SELECT * FROM user_notifications WHERE notif_to_id = ?`,
    count: 1,
  },
  updateIsRead: {
    sql: `UPDATE user_notifications SET isRead = '1' WHERE user_notifications.DocEntry = ?`,
    count: 1,
  },
  insertNotif: {
    sql: `INSERT INTO user_notifications 
    ( created_by, notif_to_id, title, msg)
    VALUES
    ( ?,?,?,?)`,
    count: 4,
  },
  getAuditLogsByDate: {
    sql: `
    SELECT 
      id,
      table_name,
      record_id,
      action_type,
      old_data,
      new_data,
      user_name,
      created_at
    FROM audit_log
    WHERE created_at BETWEEN CONCAT(?, ' 00:00:00') AND CONCAT(?, ' 23:59:59')
    ORDER BY created_at DESC
  `,
    count: 2,
  },



  getAllUsers: {
    sql: "SELECT * FROM `ousr`",
    count: 0,
  },




  checkPasswordWithID: {
    sql: "SELECT * FROM `ousr` where DocEntry = ? and pass = ? ",
    count: 2,
  },




  updateUserlevel: {
    sql: "UPDATE `ousr` SET `type` = ?  WHERE `ousr`.`DocEntry` = ?;",
    count: 2,
  },

  updateUserVoid: {
    sql: "UPDATE `ousr` SET `void` = ? WHERE `ousr`.`DocEntry` = ?;",
    count: 2,
  },


  insertUser: {
    sql: "INSERT INTO `ousr` ( `type`, `email`, `FirstName`, `MiddleName`, `LastName`, `user`, `pass`) VALUES ('3', ?, ?, ?, ?, ?, ?);",
    count: 6,
  },
  insert_chart_of_accounts: {
    sql: "INSERT INTO `chart_of_accounts` (`Code`, `Name`,  `createdBy`,  `type`) VALUES ( ?, ?, ?, ?);",
    count: 4,
  },


  SelectAllChartOfAccount: {
    sql: "SELECT *,if(Void =1,'Active','Inactive') as status FROM `chart_of_accounts` where void = 1",
    count: 0,
  },


  insertchart_of_accountsmap: {
    sql: "INSERT INTO `chart_of_accountsmap` ( `Type`, `Dr_code`, `Ar_code`, `createdBy`) VALUES ( ?, ?, ?,  ?);",
    count: 4,
  },

  ChartOfAccountPerType: {
    sql: "SELECT Code , Name FROM chart_of_accounts where  type = ?",
    count: 1,
  },

  insertBookings: {
    sql: `INSERT INTO bookings (projects_data_a_header_entry, Title, bookingDate, CreatedBy) VALUES (?, ?, ?, ?);`,
    count: 4,
  },

  updateBookingsVoid0: {
    sql: `
      UPDATE bookings SET void = 0 WHERE DocEntry = ?; `,
    count: 1,
  },
  getprojects_data_a_headerWhereNotInBooking: {
    sql: `SELECT  
    A.DocEntry
    ,B.FirstName
    ,B.MiddleName
    ,B.LastName
    ,C.Title,
    C.Disc
    FROM projects_data_a_header A 
    LEFT JOIN ousr B on A.CreatedBy = B.DocEntry
    LEFT JOIN projects C on C.DocEntry = A.ProjectID
    where A.DocEntry not in (SELECT projects_data_a_header_entry FROM bookings WHERE void = 1) and     A.ProjectID != 24 `,
    count: 0,
  },



  getprojects_data_a_headerWhereNotInBookingPerDay: {
    sql: `SELECT  
distinct
    E.DocEntry
    ,B.FirstName
    ,B.MiddleName
    ,B.LastName
    ,C.Title,
    C.Disc 
    ,E.bookingDate
    ,if(v.DocEntry is not null ,'Evaluated','Pending' ) istatus
    FROM projects_data_a_header A 
    LEFT JOIN ousr B on A.CreatedBy = B.DocEntry
    LEFT JOIN projects C on C.DocEntry = A.ProjectID
    LEFT JOIN bookings E on E.projects_data_a_header_entry = A.DocEntry
    LEFT JOIN evaluation v on v.bookingid = E.DocEntry
    where  E.void =1 and E.bookingDate = ? and A.ProjectID != 24` ,
    count: 1,
  },


  getprojects_data_a_headerWhereNotInBookings: {
    sql: `SELECT  
distinct
    A.DocEntry
    ,B.FirstName
    ,B.MiddleName
    ,B.LastName
    ,C.Title,
    C.Disc 
    ,E.bookingDate
    FROM projects_data_a_header A 
    LEFT JOIN ousr B on A.CreatedBy = B.DocEntry
    LEFT JOIN projects C on C.DocEntry = A.ProjectID
    LEFT JOIN bookings E on E.projects_data_a_header_entry = A.DocEntry where e.void = 1   
    and  A.ProjectID != 24  and E.DocEntry not in (SELECT bookingid FROM evaluation)`
    ,
    count: 0,
  },

  setbookingsVoid0: {
    sql: `UPDATE bookings SET void = '0' WHERE bookings.DocEntry = ?`,
    count: 1,
  },


  getBookingForEvaluation: {
    sql: `SELECT  
    B.CreatedBy, 
        A.DocEntry
    ,C.FirstName
    ,C.MiddleName
    ,C.LastName
    FROM bookings A
    LEFT JOIN projects_data_a_header B on A.projects_data_a_header_entry = B.DocEntry
    LEFT JOIN ousr C on C.DocEntry = B.CreatedBy
    where A.DocEntry = ?`,
    count: 1,
  },

  getEvls: {
    sql: `SELECT 
      A.DocEntry,
      E.DocEntry UID
      ,E.firstname
      ,E.LastName
      ,E.MiddleName
      ,B.BookingDate
      ,C.createdDate requestedDate
      ,F.Title
      ,F.Disc
      ,A.createdDate
      ,C.DocEntry projects_data_a_headerEntry
      ,G.DocEntry FunEntry_ID
      ,G.confirm_recieveBy
      FROM evaluation A
      LEFT JOIN bookings B on A.bookingid = B.DocEntry
      LEFT JOIN projects_data_a_header C on C.DocEntry = B.projects_data_a_header_entry
      LEFT JOIN ousr E on E.DocEntry = C.CreatedBy
      LEFT JOIN projects F on F.DocEntry = C.ProjectID
	    LEFT JOIN fund_entry G on G.project_header_id = C.DocEntry
      where E.DocEntry is not null
      and A.CreatedDate BETWEEN ? and ?`,
    count: 2,
  },



  getEval: {
    sql: `SELECT 
   *    FROM evaluation A   where A.DocEntry = ?`,
    count: 1,
  },

  CheckUserEmail: {
    sql: "SELECT email FROM `ousr` where email = ?;",
    count: 1,
  },
  getAdmins: {
    sql: "SELECT DocEntry,FirstName,MiddleName,LastName FROM `ousr` where type = 1 and void = 1;",
    count: 0,
  },
  getUserByEmail: {
    sql: "SELECT * FROM OUSR WHERE DocEntry = ? LIMIT 1",
    count: 1,
  },
  getUserWithPassword: {
    sql: `
     SELECT A.*
FROM OUSR A
LEFT JOIN vwdmf_approval_status B 
    ON A.DocEntry = B.DocEntry 
   AND B.project_id = 1 
   AND B.FinalApprovalStatus = 'Approved'
WHERE A.void = 1
  AND (A.user = ? OR A.email = ?)
  AND A.pass = ?
  AND B.DocEntry IS NOT NULL
LIMIT 1;
`,
    count: 3,
  },
  listAllUsers: {
    sql: "SELECT user, U_NAME FROM OUSR",
    count: 0,
  },
  insertProject: {
    sql: "INSERT INTO `projects` (`AddedBy`, `Title`, `Disc`, `createdDate`, `void`) VALUES (?, ?, ?, current_timestamp(), '0')",
    count: 3,
  },
  insertProjectRequirement: {
    sql: "INSERT INTO `projects_requirements` (`DocEntry`, `type`, `title`, `value`, `createdBy`, `createdDate`, `LineID`, `void`) VALUES (?, ?, ?, ?, ?, current_timestamp(), ?, '1')",
    count: 6,
  },
  getProjects: {
    sql: "SELECT * FROM `projects`",
    count: 0,
  },
  getProjectsById: {
    sql: "SELECT * FROM `projects` where DocEntry = ?",
    count: 1,
  },
  setProjectVoid: {
    sql: "UPDATE `projects` SET `void` = ? WHERE `projects`.`DocEntry` = ?;",
    count: 2,
  },
  getProjecsInFOrm: {
    sql: "SELECT * FROM `projects` as A LEFT JOIN `projects_requirements` as B on A.DocEntry = B.DocEntry where A.DocEntry = ? order by B.LineId;",
    count: 1,
  },
  getProjecsVoid1: {
    sql: "SELECT * FROM `projects` where void = 1;",
    count: 0,
  },

  getProjecsVoidwID: {
    sql: "CALL FormListPerUserId(?)",
    count: 1,
  },
  getListOfApprovals: {
    sql: "SELECT * FROM `projects` where void = 1;",
    count: 0,
  },
  insert_approval: {
    sql: "INSERT INTO approvals ( project_id, Title, description, type, createdBy, createdDate, void) VALUES (?, ?, ?, ?, ?, current_timestamp(), '0');",
    count: 5,
  },
  insert_approval_approvers: {
    sql: "INSERT INTO `approvals_approvers` ( `DocEntry`, `uID`, `createdDate`, `void`) VALUES ( ?, ?, current_timestamp(), '1');",
    count: 2,
  },
  setVoidApproval: {
    sql: "UPDATE `approvals` SET `void` = ? WHERE `approvals`.`DocEntry` = ?;",
    count: 2,
  },
  setApproval: {
    sql: "INSERT INTO approvals_decisions (DocEntry, ApprovalID, ApprovalApproverID) SELECT ?,A.DocEntry, B.uID FROM approvals A LEFT JOIN approvals_approvers B ON A.DocEntry = B.DocEntry AND A.void = 1 WHERE A.project_id = ? AND A.void = 1;",
    count: 2,

  }, getApprovers: {
    sql: `SELECT B.FirstName,B.LastName,B.MiddleName FROM approvals_approvers A
    LEFT JOIN ousr B on A.uID = B.DocEntry
    where A.DocEntry = ?`,
    count: 1,

  },
  getForApproval: {
    sql: `
    SELECT distinct * FROM (
      SELECT A.createdDate,A.DocNum AS ApprovalNum, A.DocEntry AS DocNum, B.FirstName, B.LastName, B.MiddleName, 
             C.Title, C.description, A.decision, C.project_id, V.FinalApprovalStatus, A.ApprovalApproverID ,XX.CreatedBy
      FROM approvals_decisions A 
      LEFT JOIN ousr B ON A.ApprovalApproverID = B.DocEntry 
      LEFT JOIN approvals C ON C.DocEntry = A.ApprovalID 
      LEFT JOIN vwdmf_approval_status V ON V.project_id = C.project_id AND V.DocEntry = A.DocEntry 
  		LEFT JOIN projects_data_a_header XX on XX.DocEntry = A.DocEntry
      WHERE A.void = 1 AND C.void = 1 AND B.void = 1 
        AND (? = 0 OR A.ApprovalApproverID = ?) 
        AND (? = 'all' OR V.FinalApprovalStatus = ?) 
        AND A.createdDate BETWEEN ? AND ?
    ) AS approval_subquery
  `,
    count: 6
  }
  ,
  getUserForApproval: {
    sql: "SELECT C.* FROM approvals_decisions A LEFT JOIN approvals B on B.DocEntry = A.ApprovalID LEFT JOIN ousr C on C.DocEntry = A.docEntry where A.DocEntry = ? LIMIT 1; ",
    count: 1,
  },

  getUnBooked: {
    sql: `
SELECT  
    A.DocEntry
    ,B.FirstName
    ,B.MiddleName
    ,B.LastName
    ,C.Title,
    C.Disc,
    E.FinalApprovalStatus,
    E.project_id projectID
        ,A.createdDate
        ,A.CreatedBy

    FROM projects_data_a_header A 
    LEFT JOIN ousr B on A.CreatedBy = B.DocEntry
    LEFT JOIN projects C on C.DocEntry = A.ProjectID
	LEFT JOIN vwdmf_approval_status E on E.project_id = C.DocEntry and E.DocEntry = A.DocEntry
    where A.DocEntry not in (SELECT projects_data_a_header_entry FROM bookings WHERE void = 1) and     A.ProjectID != 24
    and E.FinalApprovalStatus ='Approved'
    `,
    count: 0,
  },


  getBooked: {
    sql: `
SELECT  
    A.DocEntry
    ,B.FirstName
    ,B.MiddleName
    ,B.LastName
    ,C.Title,
    C.Disc,
    E.FinalApprovalStatus,
    E.project_id projectID
        ,A.createdDate
        ,A.CreatedBy
        ,S.DocEntry BookingId
	,S.bookingDate
    FROM projects_data_a_header A 
    LEFT JOIN ousr B on A.CreatedBy = B.DocEntry
    LEFT JOIN projects C on C.DocEntry = A.ProjectID
	LEFT JOIN vwdmf_approval_status E on E.project_id = C.DocEntry and E.DocEntry = A.DocEntry
    LEFT JOIN bookings S on S.projects_data_a_header_entry = A.DocEntry and S.void = 1
    where A.DocEntry  in (SELECT projects_data_a_header_entry FROM bookings WHERE void = 1) and     A.ProjectID != 24
    
    and S.bookingDate BETWEEN ? and ?  and S.DocEntry not in (SELECT bookingid FROM evaluation)`,
    count: 2,
  },
  setApprovalState: {
    sql: "UPDATE `approvals_decisions` SET `decision` = ? WHERE `approvals_decisions`.`DocNum` = ?; ",
    count: 2,
  },


  setOusrVoid1: {
    sql: "UPDATE `ousr` SET `void` = '1' WHERE `ousr`.`DocEntry` = ?;",
    count: 1,
  },
  insertselectionlist: {
    sql: "INSERT INTO `selectionlist` ( `CreatedBy`, `Code`, `Name`) VALUES ( ?, ?, ?); ",
    count: 3,
  },
  insertselectionlist_fields: {
    sql: "INSERT INTO `selectionlist_fields` ( `DocEntry`, `name`, `lineNum`) VALUES ( ?,?,?); ",
    count: 3,
  },
  getSelectionHeaderVoid1: {
    sql: "SELECT * FROM `selectionlist` where Void = 1; ",
    count: 0,
  },

  getselectionlist: {
    sql: "SELECT * FROM `selectionlist` ",
    count: 0,
  },
  getTableFieldColumns: {
    sql: `SELECT A.* , if(B.Code is null , A.label , B.Code) tablename FROM projects_requirements_table  a 
        LEFT JOIN selectionlist b on B.DocEntry = A.label  
        where A.DocEntry =  ?` ,
    count: 1,
  },
  getselectionlistPerRow: {
    sql: `SELECT * FROM selectionlist A
      LEFT JOIN selectionlist_fields B on A.DoCEntry = B.DocEntry
      where A.DoCEntry = ?`,
    count: 1,
  },
  getselectionlistPerRowDocnum: {
    sql: `SELECT A.DocNum , B.DocNum as DocEntry , B.name FROM projects_requirements A 
LEFT JOIN selectionlist_fields B on A.value = B.DocEntry
where A.DocNum = ? and B.void = 1;`,
    count: 1,
  },



  getselectionlistvoid1: {
    sql: "SELECT * FROM `selectionlist` where void = 1 ",
    count: 0,
  },

  insertTableColumn: {
    sql: "INSERT INTO `projects_requirements_table` (`DocEntry`, `LineNum`, `label`, `type`) VALUES ( ?, ?, ?, ?); ",
    count: 4,
  },

  insert_projects_data_a_header: {
    sql: "INSERT INTO `projects_data_a_header` (`CreatedBy`, `ProjectID`) VALUES ( ?, ?);",
    count: 2,
  },

  insert_projects_data_b_lines: {
    sql: "INSERT INTO `projects_data_b_lines` ( `DocEntry`, `Requirements_id`, `Requirements_value`) VALUES ( ?,?,?);",
    count: 3,
  }, insert_projects_data_c_table: {
    sql: "INSERT INTO `projects_data_c_table` ( `DocEntry`, `Requirements_id`, `Requirements_value` , `LineID`) VALUES ( ?,?,?,?);",
    count: 4,
  },
  getProjectDataValue: {
    sql: "select  * from vwproject_data_entries where DocEntry = ?",
    count: 1,
  },
  insertEvaluation: {
    sql: "INSERT INTO evaluation ( bookingid, type_of_house, other_source_of_income, occupation, monthly_income, number_of_meals, source_of_water_per_month, source_of_fuel_per_month, source_of_light_per_month, house_and_lot, appliances, economic_condition, expenditures_vs_income_analysis, evaluation_recommendation, problem_presented, economic_and_family_background, assessment , recommendation) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );",
    count: 18,
  },
  getprojects_data_c_table: {
    sql: `SELECT A.DocNum,
    if(B.name is null , A.Requirements_value , B.name) iValue,
    A.Requirements_id
    ,A.LineID
    FROM projects_data_c_table A
    LEFT JOIN selectionlist_fields B on A.Requirements_value = B.DocNum
    where  A.DocEntry  in 
(SELECT A.DocNum FROM projects_data_b_lines A where A.Requirements_id = ? and A.DocEntry = ?);`,
    count: 2,
  },


  getvwproject_table_label: {
    sql: "select  * from vwproject_table_label where DocEntry = ?",
    count: 1,
  },


  getDocEntryUI: {
    sql: `SELECT A.DocEntry
        FROM projects_data_a_header A
        LEFT JOIN vwdmf_approval_status B ON A.DocEntry = B.DocEntry
        WHERE A.CreatedBy = ?
          AND B.FinalApprovalStatus = 'Approved'
        LIMIT 1;`,
    count: 1,
  },

  insertRole_managerStaff: {
    sql: `
          INSERT INTO role_manager (nav_id, staff)
    VALUES 
    (?, ?)
    ON DUPLICATE KEY UPDATE
    staff = VALUES(staff)
    `,
    count: 2,
  },


  insertRole_managerUser: {
    sql: `
          INSERT INTO role_manager (nav_id, user)
    VALUES 
    (?, ?)
    ON DUPLICATE KEY UPDATE
    user = VALUES(user)
    `,
    count: 2,
  },

  getDashBoard: {
    sql: `SELECT * FROM role_manager`,
    count: 0,
  },


  getApprovalWithApprovers: {
    sql: `
      SELECT 
        A.DocEntry as ApprovalDocEntry,
        A.Title,
        A.description,
        A.type,
        AP.DocEntry as ApproverDocEntry,
        CONCAT(U.FirstName, ' ', U.MiddleName, ' ', U.LastName) as FullName,
        A.void
      FROM approvals A
      LEFT JOIN approvals_approvers AP ON A.DocEntry = AP.DocEntry AND AP.void = 1
      LEFT JOIN ousr U ON AP.uID = U.DocEntry
      WHERE A.project_id = ?;
    `,
    count: 1,
    transformType: 'groupBy',
    groupBy: 'ApprovalDocEntry',
    childKey: 'approvals_approvers',
    childFields: ['ApproverDocEntry', 'FullName'],
  },
};


export async function POST(request: NextRequest) {
  const { queryName, params = [], options = {}, finalOptions = {} } = await request.json();
  console.log({ options });
  console.log({ finalOptions });

  const entry = queryMap[queryName];
  if (!entry)
    return NextResponse.json({ success: false, message: "Query not allowed" }, { status: 403 });

  if (params.length !== entry.count)
    return NextResponse.json({ success: false, message: "Invalid parameter count" }, { status: 400 });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  // 🧩 helper: detect key column name dynamically
  async function getPrimaryKeyColumn(table_name: string) {
    const [columns] = await connection.query<any[]>(
      `SELECT COLUMN_NAME 
     FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = ? 
      AND COLUMN_NAME IN ('id', 'DocEntry', 'DocNum') 
      AND TABLE_SCHEMA = DATABASE()`,
      [table_name]
    );

    const colList = (columns as any[]).map(c => c.COLUMN_NAME);

    return colList.includes("id")
      ? "id"
      : colList.includes("DocEntry")
        ? "DocEntry"
        : colList.includes("DocNum")
          ? "DocNum"
          : null;
  }

  try {
    let old_data: any = null;
    let new_data: any = null;
    let record_id: string | number | null = null;
    let table_name = "unknown_table";

    const sqlText = entry.sql.toLowerCase();
    const isInsert = sqlText.startsWith("insert");
    const isUpdate = sqlText.startsWith("update");
    const isDelete = sqlText.startsWith("delete");

    // 🧩 Extract table name
    const match = entry.sql.match(/(?:into|update|from)\s+`?(\w+)`?/i);
    if (match) table_name = match[1];

    // 🧾 Get key column
    const keyColumn = (await getPrimaryKeyColumn(table_name)) ?? "id";

    // 🧾 Fetch old data BEFORE update/delete
    if (isUpdate || isDelete) {
      const targetId = params[params.length - 1];
      const [oldRows] = await connection.query(
        `SELECT * FROM \`${table_name}\` WHERE \`${keyColumn}\` = ? LIMIT 1`,
        [targetId]
      );
      old_data = (oldRows as any)[0] ?? null;
      record_id = targetId;
    }

    // 🧠 Execute main SQL
    const [result] = await connection.query(entry.sql, params);

    // 🆕 Fetch new data AFTER INSERT
    console.log({ table_name });
    if (isInsert) {
      record_id = (result as any).insertId ?? null;
      if (record_id) {
        const [rows] = await connection.query(
          `SELECT * FROM \`${table_name}\` WHERE \`${keyColumn}\` = ? LIMIT 1`,
          [record_id]
        );
        new_data = (rows as any)[0] ?? null;
      } else {
        new_data = { params };
      }
    }

    // 🆕 Fetch new data AFTER UPDATE
    if (isUpdate) {
      const targetId = params[params.length - 1];
      const [newRows] = await connection.query(
        `SELECT * FROM \`${table_name}\` WHERE \`${keyColumn}\` = ? LIMIT 1`,
        [targetId]
      );
      new_data = (newRows as any)[0] ?? null;
    }

    if (isDelete) new_data = null;

    // 🧾 Audit logging
    if (isInsert || isUpdate || isDelete) {
      const actorName =
        finalOptions?.userName?.trim() || finalOptions?.user_name?.trim() || "system";

      await logAudit(
        connection,
        table_name,
        record_id,
        isInsert ? "INSERT" : isUpdate ? "UPDATE" : "DELETE",
        old_data,
        new_data,
        actorName
      );
    }

    await connection.end();

    // ✅ Return insertId if applicable
    if (
      [
        "insert_chart_of_accounts",
        "setApproval",
        "insert_projects_data_b_lines",
        "insert_projects_data_a_header",
        "insertselectionlist",
        "insertProjectRequirement",
        "insertProject",
        "insertUser",
        "insert_approval",
        "insert_approval_approvers",
        "setVoidApproval",
      ].includes(queryName)
    ) {
      const insertId = (result as any).insertId;
      return NextResponse.json({ success: true, insertId });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Error:", err);
    await connection.end();
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


// export async function POST(request: NextRequest) {
//   const { queryName, params = [], options = {}, finalOptions = {} } = await request.json();
//   console.log({ options })
//   console.log({ finalOptions })
//   const entry = queryMap[queryName];
//   if (!entry)
//     return NextResponse.json(
//       { success: false, message: "Query not allowed" },
//       { status: 403 }
//     );

//   if (params.length !== entry.count)
//     return NextResponse.json(
//       { success: false, message: "Invalid parameter count" },
//       { status: 400 }
//     );

//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//   });

//   try {
//     let old_data: any = null;
//     let new_data: any = null;
//     let record_id: string | number | null = null;
//     let table_name = "unknown_table";

//     const sqlText = entry.sql.toLowerCase();
//     const isInsert = sqlText.startsWith("insert");
//     const isUpdate = sqlText.startsWith("update");
//     const isDelete = sqlText.startsWith("delete");

//     // 🧩 Extract table name early
//     const match = entry.sql.match(/(?:into|update|from)\s+`?(\w+)`?/i);
//     if (match) table_name = match[1];

//     // 🧾 Fetch old data BEFORE update or delete
//     if (isUpdate || isDelete) {
//       const whereMatch = entry.sql.match(/where\s+`?(\w+)`?\.`?(\w+)`?\s*=\s*\?/i);
//       const idColumn = whereMatch ? whereMatch[2] : "id";
//       const targetId = params[params.length - 1];

//       const [oldRows] = await connection.query(
//         `SELECT * FROM \`${table_name}\` WHERE \`${idColumn}\` = ?`,
//         [targetId]
//       );
//       old_data = (oldRows as any)[0] ?? null;
//       record_id = targetId;
//     }

//     // 🧠 Execute main SQL
//     const [result] = await connection.query(entry.sql, params);

//     // 🆕 Fetch new data AFTER execution
//     console.log({ table_name })
//     if (isInsert) {
//       record_id = (result as any).insertId ?? null;
//       if (record_id) {
//         const [rows] = await connection.query(
//           `SELECT * FROM \`${table_name}\` WHERE id = ? OR DocEntry = ? LIMIT 1`,
//           [record_id, record_id]
//         );
//         new_data = (rows as any)[0] ?? null;
//       } else {
//         new_data = { params };
//       }
//     }

//     if (isUpdate) {
//       const whereMatch = entry.sql.match(/where\s+`?(\w+)`?\.`?(\w+)`?\s*=\s*\?/i);
//       const idColumn = whereMatch ? whereMatch[2] : "id";
//       const targetId = params[params.length - 1];

//       const [newRows] = await connection.query(
//         `SELECT * FROM \`${table_name}\` WHERE \`${idColumn}\` = ?`,
//         [targetId]
//       );
//       new_data = (newRows as any)[0] ?? null;
//     }

//     if (isDelete) new_data = null;

//     // 🧾 Log to audit trail
//     if (isInsert || isUpdate || isDelete) {
//       const actorName =
//         finalOptions?.userName?.trim() || finalOptions?.user_name?.trim() || "system";

//       await logAudit(
//         connection,
//         table_name,
//         record_id,
//         isInsert ? "INSERT" : isUpdate ? "UPDATE" : "DELETE",
//         old_data,
//         new_data,
//         actorName
//       );
//     }

//     await connection.end();

//     // ✅ Return insertId if applicable
//     if (
//       [
//         "insert_chart_of_accounts",
//         "setApproval",
//         "insert_projects_data_b_lines",
//         "insert_projects_data_a_header",
//         "insertselectionlist",
//         "insertProjectRequirement",
//         "insertProject",
//         "insertUser",
//         "insert_approval",
//         "insert_approval_approvers",
//         "setVoidApproval",
//       ].includes(queryName)
//     ) {
//       const insertId = (result as any).insertId;
//       return NextResponse.json({ success: true, insertId });
//     }

//     return NextResponse.json({ success: true, data: result });
//   } catch (err: any) {
//     console.error("Error:", err);
//     await connection.end();
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }


async function logAudit(
  connection: mysql.Connection,
  table_name: string,
  record_id: string | number | null,
  action_type: "INSERT" | "UPDATE" | "DELETE",
  old_data: any,
  new_data: any,
  user_name: string
) {
  const sql = `
    INSERT INTO audit_log (table_name, record_id, action_type, old_data, new_data, user_name)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    table_name,
    record_id,
    action_type,
    old_data ? JSON.stringify(old_data) : null,
    new_data ? JSON.stringify(new_data) : null,
    user_name,
  ];

  console.log("AUDIT_LOG:", { table_name, record_id, action_type, user_name });
  await connection.query(sql, params);
}


