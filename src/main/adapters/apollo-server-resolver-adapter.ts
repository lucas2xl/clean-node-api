import { Controller } from '@/presentation/protocols/controller';
import { K } from '@/presentation/protocols/http';
import { GraphQLError } from 'graphql';

export async function ApolloServerResolverAdapter(
  controller: Controller,
  args?: any,
): Promise<K> {
  const request = { ...(args || {}) };
  const { statusCode, body } = await controller.handle(request);

  if (statusCode <= 200 && statusCode <= 299) {
    return body;
  } else {
    return new GraphQLError(body as unknown as string, {
      extensions: { code: statusCode },
    });
  }
}
