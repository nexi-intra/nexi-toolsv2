/* 
File have been automatically created. To prevent the file from getting overwritten
set the Front Matter property ´keep´ to ´true´ syntax for the code snippet
---
keep: false
---
 */
-- sure sild
CREATE TABLE
    public.tool (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tenant character varying COLLATE pg_catalog."default" NOT NULL,
            searchindex character varying COLLATE pg_catalog."default" NOT NULL,
            name character varying COLLATE pg_catalog."default" NOT NULL,
            description character varying COLLATE pg_catalog."default",
            Translations JSONB,
            category_id int NOT NULL,
            url character varying COLLATE pg_catalog."default" NOT NULL,
            status character varying COLLATE pg_catalog."default",
            Documents JSONB,
            metadata JSONB,
            icon character varying COLLATE pg_catalog."default",
    );

ALTER TABLE IF EXISTS public.tool ADD FOREIGN KEY (category_id) REFERENCES public.category (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.tool_m2m_country (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tool_id int,
            country_id int
    );

ALTER TABLE public.tool_m2m_country ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.tool_m2m_country ADD FOREIGN KEY (country_id) REFERENCES public.country (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.tool_m2m_purpose (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tool_id int,
            purpose_id int
    );

ALTER TABLE public.tool_m2m_purpose ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.tool_m2m_purpose ADD FOREIGN KEY (purpose_id) REFERENCES public.purpose (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.tool_m2m_userrole (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tool_id int,
            userrole_id int
    );

ALTER TABLE public.tool_m2m_userrole ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.tool_m2m_userrole ADD FOREIGN KEY (userrole_id) REFERENCES public.userrole (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.tool_m2m_accesspoint (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tool_id int,
            accesspoint_id int
    );

ALTER TABLE public.tool_m2m_accesspoint ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.tool_m2m_accesspoint ADD FOREIGN KEY (accesspoint_id) REFERENCES public.accesspoint (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.tool_m2m_language (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tool_id int,
            language_id int
    );

ALTER TABLE public.tool_m2m_language ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.tool_m2m_language ADD FOREIGN KEY (language_id) REFERENCES public.language (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

-- lollipop
CREATE TABLE
    public.tool_m2m_category (
        id SERIAL PRIMARY KEY,
        created_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            created_by character varying COLLATE pg_catalog."default",
            updated_at timestamp
        with
            time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_by character varying COLLATE pg_catalog."default",
            deleted_at timestamp
        with
            time zone,
            koksmat_masterdataref VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_id VARCHAR COLLATE pg_catalog."default",
            koksmat_masterdata_etag VARCHAR COLLATE pg_catalog."default",
            koksmat_compliancetag VARCHAR COLLATE pg_catalog."default",
            koksmat_state VARCHAR COLLATE pg_catalog."default",
            koksmat_bucket JSONB,
            tool_id int,
            category_id int
    );

ALTER TABLE public.tool_m2m_category ADD FOREIGN KEY (tool_id) REFERENCES public.tool (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

ALTER TABLE public.tool_m2m_category ADD FOREIGN KEY (category_id) REFERENCES public.category (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION NOT VALID;

---- create above / drop below ----
DROP TABLE IF EXISTS public.tool_m2m_country;

DROP TABLE IF EXISTS public.tool_m2m_purpose;

DROP TABLE IF EXISTS public.tool_m2m_userrole;

DROP TABLE IF EXISTS public.tool_m2m_accesspoint;

DROP TABLE IF EXISTS public.tool_m2m_language;

DROP TABLE IF EXISTS public.tool_m2m_category;

DROP TABLE public.tool;