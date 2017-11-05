using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Mvc;
using ddk.Tzemah.WebNew.Models;
//using DDK.Inf.Log;
using Geoview.SoilManagement.ReportGenerator;

namespace ddk.Tzemah.WebNew.Controllers
{
    //[Log]
    public class ReportController : Controller
    {

        [HttpPost]

        public ActionResult Generate(ReportModel reportData)
        {

            //get labData for pits
            try
            {
                DataCell[,] pitsTable = reportData.PitsTable == null ? null : CreateDataGrid(reportData.PitsTable);
                DataCell[,] labDataGrid = reportData.LabDataTable == null ? null : CreateDataGrid(reportData.LabDataTable); ;
                DataCell[,] fieldDataGrid = reportData.FieldDataTable == null ? null : CreateDataGrid(reportData.FieldDataTable);

                //if (exportedMapFile != "")
                //{
                ReportGenerator tagReplacer = new ReportGenerator(Path.Combine(HttpRuntime.AppDomainAppPath, @"images\TzemahReportTemplate.docx"));
                TempData["doc"] = tagReplacer.BuildReport(pitsTable, labDataGrid, fieldDataGrid,
                    reportData.ImageUrl, reportData.AttachUrls);
            }
            catch (Exception e)
            {
                //Logger.LogMessage(LogInfo.Error, "Problem creating report" + e);
                return Json(new { status = "ERROR", e.InnerException, e.Message }); ;
            }
            byte[] report = (byte[])TempData["doc"];

            TempData["doc"] = report;
            return Json(new { status = "OK", reportLength = report.Length });

        }
        [HttpGet]
        public ActionResult GetReport()
        {
            byte[] report = (byte[])TempData["doc"];
            if (report != null)
            {

                return File(report, "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "Report-" + DateTime.Now.ToString(@"dd-MM-yyyy-hh-mm") + ".docx");
            }
            else
            {
                return Json(new { status = "ERROR" }, JsonRequestBehavior.AllowGet);
            }

        }

        #region Private





        private DataCell[,] CreateDataGrid(ReportTableModel reportTable)
        {
            if (reportTable.TableData == null || reportTable.TableData.Count == 0)
            {
                return null;
            }

            DataCell[,] result = new DataCell[reportTable.TableData.Count + 1, reportTable.Header.Count];
            for (int i = 0; i < reportTable.Header.Count; i++)
            {
                result[0, i] = new DataCell(reportTable.Header[i]);
            }
            for (int i = 0; i < reportTable.TableData.Count; i++)
            {
                ReportTableRow row = reportTable.TableData[i];
                for (int j = 0; j < row.Count; j++)
                {
                    string value = row[j].Value;
                    if (value == null)
                    {
                        value = string.Empty;
                    }
                    CellColor cellColor = row[j].Color;
                    result[i + 1, j] = new DataCell(value,
                        Color.FromArgb(255, cellColor.Red, cellColor.Green, cellColor.Blue));
                }
            }
            return result;
        }

        #endregion


    }
}