

export async function GET () {
    return Response.json({ succes: true, message: 'Api is not protected' }, { status: 200 })

}