package com.vesta.backend.service;

import com.vesta.backend.model.Order;
import com.vesta.backend.repository.OrderRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelService {

    private final OrderRepository orderRepository;

    public ExcelService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public ByteArrayInputStream siparisleriExceleDok() throws IOException {
        List<Order> orders = orderRepository.findAll();

        // 1. Yeni bir Excel Sayfası Oluşturuyoruz
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Sipariş Raporu");

            // 2. Başlık Stilini Belirliyoruz (Janti Görünsün)
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.BLUE_GREY.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // 3. Tablo Başlıklarını Yazıyoruz
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Sipariş ID", "Ürün Adı", "Adet", "Toplam Tutar", "Para Birimi", "Kanal (Tür)", "Sipariş Tarihi"};

            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }

            // 4. Veri Tabanındaki Siparişleri Satır Satır Excel'e İşliyoruz
            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(order.getId());
                row.createCell(1).setCellValue(order.getUrunAdi());
                row.createCell(2).setCellValue(order.getAdet());
                row.createCell(3).setCellValue(order.getToplamTutar());
                row.createCell(4).setCellValue(order.getParaBirimi());
                row.createCell(5).setCellValue(order.getSiparisTuru());
                row.createCell(6).setCellValue(order.getSiparisTarihi().toString());
            }

            // Sütun genişliklerini otomatik ayarla
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}