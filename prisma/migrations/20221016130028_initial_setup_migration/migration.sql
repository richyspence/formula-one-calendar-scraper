-- CreateTable
CREATE TABLE "calendars" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "number_of_stages" INTEGER NOT NULL,

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stages" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "stage_number" INTEGER NOT NULL,
    "starts_on" TIMESTAMP(3) NOT NULL,
    "ends_on" TIMESTAMP(3) NOT NULL,
    "details_url" TEXT NOT NULL,
    "calendar_id" INTEGER NOT NULL,

    CONSTRAINT "stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "racedaytypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "racedaytypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "stages" ADD CONSTRAINT "stages_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
