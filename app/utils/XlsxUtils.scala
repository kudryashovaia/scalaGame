package utils

import org.apache.poi.hssf.usermodel.HSSFSheet

object XlsxUtils {

  implicit class PimpedSheet(s: HSSFSheet) {
    def apply(row: Int, col: Int) = {
      var r = s.getRow(row)
      if (r == null) r = s.createRow(row)
      Option(r.getCell(col)).getOrElse(r.createCell(col))
    }
    def apply(row: Int) = {
      Option(s.getRow(row)).getOrElse(s.createRow(row))
    }
    def update(row: Int, col: Int, v: Any) {
      v match {
        case opt:Option[_] => opt.foreach(v => this.update(row, col, v))
        case a:String => apply(row,col).setCellValue(a)
        case a:Double => apply(row,col).setCellValue(a)
        case a:BigDecimal => apply(row, col).setCellValue(a.toDouble)
        case a:Int => apply(row,col).setCellValue(a)
      }
    }
  }

  case class Column[A](title: String, fn: A => Any)

  def outputTable[A](sheet: HSSFSheet, items: Seq[A], columns: Seq[Column[A]]) {
    columns.zipWithIndex.foreach { case (column, columnIndex) =>
      sheet(0, columnIndex) = column.title
    }
    items.zipWithIndex.foreach { case (item, rowIndex) =>
      columns.zipWithIndex.foreach { case (column, columnIndex) =>
        sheet(rowIndex + 1, columnIndex) = column.fn(item)
      }
    }
    columns.indices.foreach(sheet.autoSizeColumn)
  }

}
