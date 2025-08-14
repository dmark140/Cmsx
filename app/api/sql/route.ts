import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Extended query map with optional transform config
// const queryMap: Record<
//   string,
//   {
//     sql: string;
//     count: number;
//     transformType?: 'groupBy';
//     groupBy?: string;
//     childKey?: string;
//     childFields?: string[];
//   }
// > = {

const queryMap: Record<
  string,
  {
    sql: string;
    count: number;
    transformType?: 'groupBy';
    groupBy?: string;
    childKey?: string;
    childFields?: string[];
  }
> = {
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
    sql: "INSERT INTO bookings (projects_data_a_header_entry, Title, bookingDate, CreatedBy) VALUES (?, ?, ?, ?);",
    count: 4,
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
    FROM projects_data_a_header A 
    LEFT JOIN ousr B on A.CreatedBy = B.DocEntry
    LEFT JOIN projects C on C.DocEntry = A.ProjectID
    LEFT JOIN bookings E on E.projects_data_a_header_entry = A.DocEntry
    where  E.void =1 and E.bookingDate = ? and A.ProjectID != 24;` ,
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
    and  A.ProjectID != 24`,
    count: 0,
  },

  setbookingsVoid0: {
    sql: `UPDATE bookings SET void = '0' WHERE bookings.DocEntry = ?`,
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
    sql: "SELECT * FROM OUSR WHERE user = ? LIMIT 1",
    count: 1,
  },
  getUserWithPassword: {
    sql: "SELECT * FROM OUSR WHERE user = ? or email = ? AND pass = ? LIMIT 1",
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

  },
  getForApproval: {
    sql: `
    SELECT * FROM (
      SELECT A.createdDate,A.DocNum AS ApprovalNum, A.DocEntry AS DocNum, B.FirstName, B.LastName, B.MiddleName, 
             C.Title, C.description, A.decision, C.project_id, V.FinalApprovalStatus, A.ApprovalApproverID 
      FROM approvals_decisions A 
      LEFT JOIN ousr B ON A.ApprovalApproverID = B.DocEntry 
      LEFT JOIN approvals C ON C.DocEntry = A.ApprovalID 
      LEFT JOIN vwdmf_approval_status V ON V.project_id = C.project_id AND V.DocEntry = A.DocEntry 
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
  setApprovalState: {
    sql: "UPDATE `approvals_decisions` SET `decision` = ? WHERE `approvals_decisions`.`DocNum` = ?; ",
    count: 2,
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
    sql: "INSERT INTO evaluation ( projectId, type_of_house, other_source_of_income, occupation, monthly_income, number_of_meals, source_of_water_per_month, source_of_fuel_per_month, source_of_light_per_month, house_and_lot, appliances, economic_condition, expenditures_vs_income_analysis, evaluation_recommendation, problem_presented, economic_and_family_background, assessment) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? );",
    count: 17,
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

// export async function POST(request: NextRequest) {
//   try {
//     const { queryName, params = [] } = await request.json();

//     const entry = queryMap[queryName];
//     console.log("Query Name:", queryName);
//     console.log("Query :", entry);
//     if (!entry) {
//       return NextResponse.json(
//         { success: false, message: "Query not allowed" },
//         { status: 403 }
//       );
//     }

//     if (params.length !== entry.count) {
//       return NextResponse.json(
//         { success: false, message: "Invalid parameter count" },
//         { status: 400 }
//       );
//     }

//     const connection = await mysql.createConnection({
//       host: process.env.DB_HOST,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//     });

//     if (entry.transformType === 'groupBy') {
//       const [rawRows] = await connection.execute(entry.sql, params);
//       await connection.end();

//       const rows = rawRows as mysql.RowDataPacket[];

//       if (!rows.length) {
//         return NextResponse.json({ success: false, message: "No record found" });
//       }

//       const groupedMap: Record<string, any> = {};

//       rows.forEach(row => {
//         const key = row[entry.groupBy!];
//         if (!groupedMap[key]) {
//           const base: Record<string, any> = { ...row };
//           entry.childFields?.forEach(field => delete base[field]);
//           base[entry.childKey!] = [];
//           groupedMap[key] = base;
//         }

//         if (row[entry.childFields![0]]) {
//           const child: Record<string, any> = {};
//           entry.childFields?.forEach(field => {
//             child[field] = row[field];
//           });

//           // Allow duplicates: push every child without deduplication
//           groupedMap[key][entry.childKey!].push(child);
//         }
//       });

//       return NextResponse.json({
//         success: true,
//         data: Object.values(groupedMap),
//       });
//     }

//     // Regular non-transform queries
//     console.log("execute entry.sql" + entry.sql + " params" + params);
//     const [result] = await connection.execute(entry.sql, params);

//     if (
//       ['insertselectionlist', 'insertProject', 'insertUser', 'insert_approval', 'insert_approval_approvers', 'setVoidApproval'].includes(queryName)
//     ) {
//       const insertId = (result as any).insertId;
//       await connection.end();
//       return NextResponse.json({ success: true, insertId });
//     }

//     await connection.end();
//     console.log("Query executed successfully:", queryName, result);
//     return NextResponse.json({ success: true, data: result });
//   } catch (err: any) {
//     console.error("Error:", err.message);
//     return NextResponse.json(
//       { success: false, message: err.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(request: NextRequest) {
  try {
    const { queryName, params = [], options = {} } = await request.json();

    const entry = queryMap[queryName];
    if (!entry) {
      return NextResponse.json(
        { success: false, message: "Query not allowed" },
        { status: 403 }
      );
    }

    if (params.length !== entry.count) {
      return NextResponse.json(
        { success: false, message: "Invalid parameter count" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    });

    if (entry.transformType === 'groupBy') {
      const [rawRows] = await connection.execute(entry.sql, params);
      await connection.end();

      const rows = rawRows as mysql.RowDataPacket[];

      if (!rows.length) {
        return NextResponse.json({ success: false, message: "No record found" });
      }

      const groupedMap: Record<string, any> = {};

      rows.forEach(row => {
        const key = row[entry.groupBy!];
        if (!groupedMap[key]) {
          const base: Record<string, any> = { ...row };
          entry.childFields?.forEach(field => delete base[field]);
          base[entry.childKey!] = [];
          groupedMap[key] = base;
        }

        if (row[entry.childFields![0]]) {
          const child: Record<string, any> = {};
          entry.childFields?.forEach(field => {
            child[field] = row[field];
          });
          groupedMap[key][entry.childKey!].push(child);
        }
      });

      return NextResponse.json({
        success: true,
        data: Object.values(groupedMap),
      });
    }

    // 🔥 Dynamic Pagination
    let finalSQL = entry.sql;
    let finalParams = [...params];
    let total = null;


    if (options.paginate) {
      const limit = Number(options.limit) || 10;
      const page = Number(options.page) || 1;
      const offset = (page - 1) * limit;

      finalSQL = entry.sql.trim().replace(/;$/, "") + " LIMIT ? OFFSET ?";
      finalParams.push(limit, offset);

      const safeSQL = entry.sql.trim().replace(/;$/, "");
      const countSQL = `SELECT COUNT(*) as total FROM (${safeSQL}) AS total_query`;
      console.log({ countSQL })
      const [countRes] = await connection.execute(countSQL, params);
      total = (countRes as any)[0].total;
      console.log({ total })

    }
    console.log({ finalSQL, finalParams })
    const [result] = await connection.execute(finalSQL.trim(), finalParams);
    console.log({ result })

    if (
      ['insert_chart_of_accounts', 'setApproval', 'insert_projects_data_b_lines', 'insert_projects_data_a_header', 'insertselectionlist', 'insertProjectRequirement', 'insertProject', 'insertUser', 'insert_approval', 'insert_approval_approvers', 'setVoidApproval'].includes(queryName)
    ) {
      const insertId = (result as any).insertId;
      await connection.end();
      return NextResponse.json({ success: true, insertId });
    }

    await connection.end();

    return NextResponse.json({
      success: true,
      data: result,
      ...(options.paginate && {
        pagination: {
          total,
          page: options.page,
          limit: options.limit,
          totalPages: Math.ceil(total / options.limit),
        },
      }),
    });

  } catch (err: any) {
    console.error("Error:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}