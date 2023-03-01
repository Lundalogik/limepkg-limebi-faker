import urllib

import flask
import lime_filter as lf
from marshmallow import Schema, fields, validate


def create_schema(application):
    def _get_host() -> str:
        """Get the host name (url domain)
        Returns: url domain
        """
        return flask.request.host

    def _get_app_name() -> str:
        """Get the application name
        Returns: application name
        """
        return urllib.parse.quote(application.identifier)

    class FakeGridSchema(Schema):
        fake_document_id1 = fields.Number(
            title="Fake Image 1",
            validate=_create_document_validator(application),
            required=True,
        )
        fake_document_id2 = fields.Number(
            title="Fake Image 2",
            validate=_create_document_validator(application),
            required=True,
        )
        fake_document_id3 = fields.Number(
            title="Fake Image 3",
            validate=_create_document_validator(application),
            required=True,
        )
        fake_document_id4 = fields.Number(
            title="Fake Image 4",
            validate=_create_document_validator(application),
            required=True,
        )

        class Meta:
            ordered = True

    class ConfigSchema(Schema):
        fake_grid_images = fields.Nested(
            title="Lime BI Faker",
            nested=FakeGridSchema,
            inline=True,
        )

        class Meta:
            ordered = True

    return ConfigSchema()


def _create_document_validator(app):
    lt_document = app.limetypes.get_limetype("document")
    exp_limebiimage = lf.EqualsOperator(field="comment", value="LIMEBI#IMAGE")
    exp_has_image = lf.NotEqualsOperator(field="document", value=None)
    document_filter = lf.Filter(lf.AndOperator(exp_limebiimage, exp_has_image))
    all_limebi_documents = lt_document.get_all(filter=document_filter)
    images = [
        (document, get_filename_from_document(app, document))
        for document in all_limebi_documents
    ]
    return validate.OneOf(
        choices=[data[0].id for data in images],
        labels=[data[1] for data in images],
    )


def get_filename_from_document(app, document):
    fileid = document.get_property("document").value
    file = app.files.fetch(fileid)
    filename = file.filename or ""
    extension = file.extension or "png"

    return filename.replace(f".{extension}", "")
