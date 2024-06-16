import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/cloudinary";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle multipart form data
  },
};

export async function PATCH(req) {
  try {
    const id = req.url.split("/updateModul/")[1];
    const formData = await req.formData();

    // Extract the new file from the formData
    const newFile = formData.get("file");

    if (!newFile) {
      return NextResponse.json({ status: 400, message: "File not found" });
    }

    // Read the new file buffer
    const fileBuffer = await newFile.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Find the existing class to get the current module URL
    const existingKelas = await prisma.kelas.findUnique({
      where: { id: parseInt(id) },
      select: { modul: true },
    });

    if (!existingKelas) {
      return NextResponse.json({ status: 404, message: "Class not found!" });
    }

    // Extract the current module URL
    const modulUrl = existingKelas.modul;

    // If the module URL exists, delete the old file from Cloudinary
    if (modulUrl) {
      const publicId = modulUrl.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }

    // Upload the new file to Cloudinary
    const result = await uploadToCloudinary(buffer);
    const newModulUrl = result.secure_url;

    // Update the class data with the new module URL
    const updatedKelas = await prisma.kelas.update({
      where: { id: parseInt(id) },
      data: {
        modul: newModulUrl,
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Berhasil ubah data!",
      data: updatedKelas,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: 400, message: "Something went wrong!" });
  }
}
