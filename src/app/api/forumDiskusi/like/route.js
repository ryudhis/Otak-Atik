import prisma from "@/utils/prisma";

export async function PATCH(req) {
  try {
    const data = await req.json();

    const dataForum= await prisma.forumDiskusi.findUnique({
        where: {
          id: data.forumId,
        },
      });

      if(dataForum.dislike.includes(data.username)){
        dataForum.dislike = dataForum.dislike.filter((data)=>{data!=data.username})
      }
      
      if(dataForum.like.includes(data.username)){
        dataForum.like = dataForum.like.filter((data)=>{data!=data.username});
      }else{
        dataForum.like = [data.username, ...dataForum.like];
      }

    const forumDiskusi = await prisma.forumDiskusi.update({
      where: {
        id: data.forumId,
      },
      data: {
        like: dataForum.like,
        dislike: dataForum.dislike,
      },
    });

    return Response.json({
      status: 200,
      message: "Berhasil ubah data!",
      data: forumDiskusi,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ status: 400, message: "Something went wrong!" });
  }
}
